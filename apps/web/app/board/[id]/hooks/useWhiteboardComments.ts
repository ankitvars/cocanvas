'use client';

import { useState, useEffect } from 'react';
import * as Y from 'yjs';
import {
  getBoardComments,
  createBoardComment,
  resolveBoardComment,
  editBoardComment,
  deleteBoardComment,
} from '../../../actions/board';

interface UseWhiteboardCommentsProps {
  boardId: string;
  doc: Y.Doc;
}

export function useWhiteboardComments({ boardId, doc }: UseWhiteboardCommentsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentPos, setNewCommentPos] = useState<{ x: number; y: number } | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [collapsedCommentIds, setCollapsedCommentIds] = useState<string[]>([]);
  const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  // Load comments from database initially & populate Yjs if first user
  useEffect(() => {
    getBoardComments(boardId).then((res: any) => {
      if (res.success && res.comments) {
        setComments(res.comments);

        const yComments = doc.getMap('board-comments');
        if (yComments.size === 0 && res.comments.length > 0) {
          doc.transact(() => {
            res.comments.forEach((c: any) => {
              const commentMap = new Y.Map();
              commentMap.set('id', c.id);
              commentMap.set('x', c.x);
              commentMap.set('y', c.y);
              commentMap.set('content', c.content);
              commentMap.set('userName', c.userName);
              commentMap.set('userAvatar', c.userAvatar);
              commentMap.set('userId', c.userId);
              commentMap.set('resolved', c.resolved);
              yComments.set(c.id, commentMap);
            });
          });
        }
      }
    });
  }, [boardId, doc]);

  // Synchronize comments from Yjs board-comments map
  useEffect(() => {
    const yComments = doc.getMap('board-comments');

    const syncComments = () => {
      const yList = Array.from(yComments.values()).map((map: any) => ({
        id: map.get('id'),
        x: map.get('x'),
        y: map.get('y'),
        content: map.get('content'),
        userName: map.get('userName'),
        userAvatar: map.get('userAvatar'),
        userId: map.get('userId'),
        resolved: map.get('resolved'),
      }));

      setComments(yList.filter((c: any) => !c.resolved));
    };

    yComments.observe(syncComments);
    return () => {
      yComments.unobserve(syncComments);
    };
  }, [doc]);

  // Create a new comment pin
  const handleCreateComment = async (text: string) => {
    if (!newCommentPos || !text.trim()) return;

    const res = await createBoardComment(boardId, newCommentPos.x, newCommentPos.y, text.trim());
    if (res.success && res.comment) {
      const yComments = doc.getMap('board-comments');
      const commentMap = new Y.Map();
      commentMap.set('id', res.comment.id);
      commentMap.set('x', res.comment.x);
      commentMap.set('y', res.comment.y);
      commentMap.set('content', res.comment.content);
      commentMap.set('userName', res.comment.userName);
      commentMap.set('userAvatar', res.comment.userAvatar);
      commentMap.set('userId', res.comment.userId);
      commentMap.set('resolved', false);

      yComments.set(res.comment.id, commentMap);

      setNewCommentPos(null);
      setNewCommentText('');
    }
  };

  // Resolve a comment
  const handleResolveComment = async (commentId: string) => {
    const res = await resolveBoardComment(commentId);
    if (res.success) {
      const yComments = doc.getMap('board-comments');
      const commentMap = yComments.get(commentId) as Y.Map<any> | undefined;
      if (commentMap) {
        commentMap.set('resolved', true);
      } else {
        yComments.delete(commentId);
      }
      setActiveCommentId(null);
    }
  };

  // Edit a comment content
  const handleSaveEditComment = async (commentId: string, text: string) => {
    if (!text.trim()) return;
    const res = await editBoardComment(commentId, text.trim());
    if (res.success) {
      const yComments = doc.getMap('board-comments');
      const commentMap = yComments.get(commentId) as Y.Map<any> | undefined;
      if (commentMap) {
        commentMap.set('content', text.trim());
      }
      setEditingCommentId(null);
    }
  };

  // Delete a comment completely
  const handleDeleteComment = async (commentId: string) => {
    const res = await deleteBoardComment(commentId);
    if (res.success) {
      const yComments = doc.getMap('board-comments');
      yComments.delete(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setActiveCommentId(null);
    }
  };

  return {
    comments,
    setComments,
    newCommentPos,
    setNewCommentPos,
    newCommentText,
    setNewCommentText,
    activeCommentId,
    setActiveCommentId,
    collapsedCommentIds,
    setCollapsedCommentIds,
    hoveredCommentId,
    setHoveredCommentId,
    editingCommentId,
    setEditingCommentId,
    editingCommentText,
    setEditingCommentText,
    handleCreateComment,
    handleResolveComment,
    handleSaveEditComment,
    handleDeleteComment,
  };
}
