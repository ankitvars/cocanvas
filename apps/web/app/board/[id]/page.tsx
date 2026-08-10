import { auth } from '../../../auth';
import { db } from '../../../lib/db';
import { boards, boardMembers } from '@cocanvas/shared';
import { eq, and } from 'drizzle-orm';
import { redirect, notFound } from 'next/navigation';
import WhiteboardWrapper from './WhiteboardWrapper';
import { acceptBoardInvite } from '../../actions/board';
import { UserPlus, ShieldAlert } from 'lucide-react';

interface BoardPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ invite?: string }>;
}

export default async function BoardPage({ params, searchParams }: BoardPageProps) {
  const { id: boardId } = await params;
  const { invite: inviteToken } = await searchParams;
  const session = await auth();

  // Find board
  const boardList = await db.select().from(boards).where(eq(boards.id, boardId)).limit(1);
  const board = boardList[0];

  if (!board) {
    notFound();
  }

  // Look up user ID from email in db
  let dbUser: any = null;
  let role: 'viewer' | 'editor' | 'admin' | null = null;
  let isOwner = false;

  if (session?.user?.email) {
    const userList = await db.select().from(schema.users).where(eq(schema.users.email, session.user.email)).limit(1);
    dbUser = userList[0];

    if (!dbUser) {
      // Create user record in DB on-the-fly!
      const result = await db.insert(schema.users).values({
        email: session.user.email,
        name: session.user.name || 'Anonymous Collaborator',
        avatarUrl: session.user.image || null,
      }).returning();
      dbUser = result[0];
    }

    if (board.ownerId === dbUser.id) {
      isOwner = true;
      role = 'admin';
    } else {
      const membershipList = await db
        .select()
        .from(boardMembers)
        .where(and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, dbUser.id)))
        .limit(1);
      const membership = membershipList[0];
      if (membership) {
        role = membership.role as any;
      }
    }
  }

  // Handle invitation link
  if (inviteToken) {
    if (!session?.user?.email) {
      // Redirect to login, then redirect back to the invite link
      const encodedDest = encodeURIComponent(`/board/${boardId}?invite=${inviteToken}`);
      redirect(`/login?redirectTo=${encodedDest}`);
    }

    // User is logged in. If they are already a member, strip the invite query param
    if (role !== null) {
      redirect(`/board/${boardId}`);
    }

    // Validate invite token
    if (!board.inviteToken || board.inviteToken !== inviteToken) {
      return (
        <main style={styles.main}>
          <div style={styles.bgGlow}></div>
          <div className="glass" style={styles.card}>
            <div style={styles.iconContainerError}>
              <ShieldAlert size={28} color="var(--color-error)" />
            </div>
            <h1 style={styles.title}>Invalid Invitation</h1>
            <p style={styles.subtitle}>
              This invitation link is invalid, has expired, or has been revoked by the owner.
            </p>
            <a href="/dashboard" style={styles.btnBack}>
              Go to Dashboard
            </a>
          </div>
        </main>
      );
    }

    // Render Accept Invite Page
    return (
      <main style={styles.main}>
        <div style={styles.bgGlow}></div>
        <div className="glass" style={styles.card}>
          <div style={styles.iconContainer}>
            <UserPlus size={28} color="#fff" />
          </div>
          <h1 style={styles.title}>Join Collaboration</h1>
          <p style={styles.subtitle}>
            You have been invited to collaborate on <strong>{board.name}</strong> as an Editor.
          </p>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <form
              action={async () => {
                'use server';
                await acceptBoardInvite(boardId, inviteToken);
                redirect(`/board/${boardId}`);
              }}
            >
              <button type="submit" style={styles.btnAccept}>
                Accept & Join Whiteboard
              </button>
            </form>
            <a href="/dashboard" style={styles.btnDecline}>
              Decline & Exit
            </a>
          </div>
        </div>
      </main>
    );
  }

  // Allow read access to public boards
  if (!role && !board.isPublic) {
    redirect('/login');
  }

  // Fetch all board members from database
  const membersList = await db
    .select({
      id: schema.users.id,
      name: schema.users.name,
      avatarUrl: schema.users.avatarUrl,
      role: boardMembers.role,
    })
    .from(boardMembers)
    .innerJoin(schema.users, eq(boardMembers.userId, schema.users.id))
    .where(eq(boardMembers.boardId, boardId));

  const userMeta = {
    id: dbUser?.id || 'anonymous',
    name: session?.user?.name || 'Anonymous Viewer',
    email: session?.user?.email || null,
    image: session?.user?.image || null,
    role: role || (board.isPublic ? 'viewer' : null),
  };

  return (
    <WhiteboardWrapper
      board={board as any}
      user={userMeta as any}
      members={membersList as any}
      wsUrl={process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000'}
    />
  );
}

// Inline schema imports fallback
import * as schema from '@cocanvas/shared';

const styles: Record<string, React.CSSProperties> = {
  main: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg-primary)',
    overflow: 'hidden',
    fontFamily: 'Inter, sans-serif',
  },
  bgGlow: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, hsla(250, 90%, 65%, 0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '400px',
    padding: '40px 32px',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: 'var(--shadow-lg)',
    textAlign: 'center',
  },
  iconContainer: {
    width: '54px',
    height: '54px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-accent-gradient)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  iconContainerError: {
    width: '54px',
    height: '54px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    marginBottom: '12px',
    color: 'var(--color-text-primary)',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  btnAccept: {
    width: '100%',
    height: '46px',
    background: 'var(--color-accent-gradient)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
  },
  btnDecline: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '46px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-secondary)',
    fontWeight: 600,
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    textDecoration: 'none',
  },
  btnBack: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '46px',
    background: 'var(--color-accent-gradient)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
  },
};
