'use server';

import { db } from '../../lib/db';
import { boards, boardMembers, users, boardComments } from '@cocanvas/shared';
import { auth } from '../../auth';
import { eq, and, desc, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Helper to ensure user is authenticated and get their database user record
async function getAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  // Find or create user in the database based on OAuth session email
  const dbUserList = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  let dbUser = dbUserList[0];

  if (!dbUser) {
    // If not present (first login), create user record
    const result = await db.insert(users).values({
      email: session.user.email,
      name: session.user.name || 'Anonymous Collaborator',
      avatarUrl: session.user.image || null,
    }).returning();
    dbUser = result[0];
  }

  return dbUser;
}

export async function getBoards() {
  try {
    const user = await getAuthenticatedUser();

    // Query boards owned by user or boards where user is a member, or public boards
    const userBoards = await db
      .select({
        id: boards.id,
        name: boards.name,
        ownerId: boards.ownerId,
        isPublic: boards.isPublic,
        createdAt: boards.createdAt,
        updatedAt: boards.updatedAt,
      })
      .from(boards)
      .leftJoin(boardMembers, eq(boardMembers.boardId, boards.id))
      .where(
        or(
          eq(boards.ownerId, user.id),
          eq(boardMembers.userId, user.id),
          eq(boards.isPublic, true)
        )
      )
      .orderBy(desc(boards.updatedAt));

    // Remove duplicates from joined queries
    const uniqueBoards = Array.from(new Map(userBoards.map(b => [b.id, b])).values());

    return { success: true, boards: uniqueBoards };
  } catch (error: any) {
    console.error('Failed to get boards:', error);
    return { success: false, error: error.message || 'Failed to retrieve boards' };
  }
}

export async function createBoard(name: string, isPublic: boolean = false) {
  try {
    const user = await getAuthenticatedUser();

    const result = await db.insert(boards).values({
      name,
      ownerId: user.id,
      isPublic,
    }).returning();

    const newBoard = result[0];

    // Add owner as admin member
    await db.insert(boardMembers).values({
      boardId: newBoard.id,
      userId: user.id,
      role: 'admin',
    });

    revalidatePath('/dashboard');
    return { success: true, board: newBoard };
  } catch (error: any) {
    console.error('Failed to create board:', error);
    return { success: false, error: error.message || 'Failed to create board' };
  }
}

export async function deleteBoard(boardId: string) {
  try {
    const user = await getAuthenticatedUser();

    // Check if the user is the owner
    const boardList = await db.select().from(boards).where(eq(boards.id, boardId)).limit(1);
    const board = boardList[0];

    if (!board) {
      throw new Error('Board not found');
    }

    if (board.ownerId !== user.id) {
      throw new Error('Only the board owner can delete it');
    }

    await db.delete(boards).where(eq(boards.id, boardId));

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete board:', error);
    return { success: false, error: error.message || 'Failed to delete board' };
  }
}

export async function updateBoard(boardId: string, updates: { name?: string; isPublic?: boolean }) {
  try {
    const user = await getAuthenticatedUser();

    // Verify ownership or admin role
    const boardList = await db.select().from(boards).where(eq(boards.id, boardId)).limit(1);
    const board = boardList[0];

    if (!board) {
      throw new Error('Board not found');
    }

    const memberList = await db
      .select()
      .from(boardMembers)
      .where(and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, user.id)))
      .limit(1);
    const member = memberList[0];

    const hasPermission = board.ownerId === user.id || (member && (member.role === 'admin' || member.role === 'editor'));
    if (!hasPermission) {
      throw new Error('You do not have permission to modify this board');
    }

    await db.update(boards).set({
      ...updates,
      updatedAt: new Date(),
    }).where(eq(boards.id, boardId));

    revalidatePath('/dashboard');
    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update board:', error);
    return { success: false, error: error.message || 'Failed to update board' };
  }
}

export async function generateInviteToken(boardId: string) {
  try {
    const user = await getAuthenticatedUser();

    // Verify user has permission (admin or owner)
    const boardList = await db.select().from(boards).where(eq(boards.id, boardId)).limit(1);
    const board = boardList[0];
    if (!board) throw new Error('Board not found');

    const memberList = await db
      .select()
      .from(boardMembers)
      .where(and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, user.id)))
      .limit(1);
    const member = memberList[0];

    const hasPermission = board.ownerId === user.id || (member && member.role === 'admin');
    if (!hasPermission) {
      throw new Error('Only owners and admins can generate invite links');
    }

    const token = crypto.randomUUID();
    await db.update(boards).set({
      inviteToken: token,
      updatedAt: new Date(),
    }).where(eq(boards.id, boardId));

    revalidatePath(`/board/${boardId}`);
    return { success: true, token };
  } catch (error: any) {
    console.error('Failed to generate invite token:', error);
    return { success: false, error: error.message || 'Failed to generate invite token' };
  }
}

export async function acceptBoardInvite(boardId: string, token: string) {
  try {
    const user = await getAuthenticatedUser();

    // Find the board
    const boardList = await db.select().from(boards).where(eq(boards.id, boardId)).limit(1);
    const board = boardList[0];
    if (!board) throw new Error('Board not found');

    // Check if token matches
    if (!board.inviteToken || board.inviteToken !== token) {
      throw new Error('Invalid or expired invite link');
    }

    // Check if user is already a member
    const memberList = await db
      .select()
      .from(boardMembers)
      .where(and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, user.id)))
      .limit(1);
    const member = memberList[0];

    if (!member && board.ownerId !== user.id) {
      // Add as editor member
      await db.insert(boardMembers).values({
        boardId,
        userId: user.id,
        role: 'editor',
      });
    }

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to accept invite:', error);
    return { success: false, error: error.message || 'Failed to accept invite' };
  }
}

export async function getBoardComments(boardId: string) {
  try {
    const user = await getAuthenticatedUser();
    const commentsList = await db
      .select({
        id: boardComments.id,
        boardId: boardComments.boardId,
        userId: boardComments.userId,
        userName: users.name,
        userAvatar: users.avatarUrl,
        x: boardComments.x,
        y: boardComments.y,
        content: boardComments.content,
        resolved: boardComments.resolved,
        createdAt: boardComments.createdAt,
      })
      .from(boardComments)
      .leftJoin(users, eq(users.id, boardComments.userId))
      .where(and(eq(boardComments.boardId, boardId), eq(boardComments.resolved, false)))
      .orderBy(desc(boardComments.createdAt));

    return { success: true, comments: commentsList.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    })) };
  } catch (error: any) {
    console.error('Failed to get comments:', error);
    return { success: false, error: error.message || 'Failed to retrieve comments' };
  }
}

export async function createBoardComment(boardId: string, x: number, y: number, content: string) {
  try {
    const user = await getAuthenticatedUser();

    const result = await db.insert(boardComments).values({
      boardId,
      userId: user.id,
      x,
      y,
      content,
      resolved: false,
    }).returning();

    const newComment = result[0];
    return { 
      success: true, 
      comment: {
        ...newComment,
        createdAt: newComment.createdAt.toISOString(),
        userName: user.name,
        userAvatar: user.avatarUrl,
      } 
    };
  } catch (error: any) {
    console.error('Failed to create comment:', error);
    return { success: false, error: error.message || 'Failed to create comment' };
  }
}

export async function resolveBoardComment(commentId: string) {
  try {
    const user = await getAuthenticatedUser();

    await db.update(boardComments).set({
      resolved: true,
    }).where(eq(boardComments.id, commentId));

    return { success: true };
  } catch (error: any) {
    console.error('Failed to resolve comment:', error);
    return { success: false, error: error.message || 'Failed to resolve comment' };
  }
}

export async function editBoardComment(commentId: string, content: string) {
  try {
    const user = await getAuthenticatedUser();
    await db.update(boardComments).set({
      content,
    }).where(eq(boardComments.id, commentId));
    return { success: true };
  } catch (error: any) {
    console.error('Failed to edit comment:', error);
    return { success: false, error: error.message || 'Failed to edit comment' };
  }
}

export async function deleteBoardComment(commentId: string) {
  try {
    const user = await getAuthenticatedUser();
    await db.delete(boardComments).where(eq(boardComments.id, commentId));
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete comment:', error);
    return { success: false, error: error.message || 'Failed to delete comment' };
  }
}
