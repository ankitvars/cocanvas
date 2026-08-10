'use client';

import React from 'react';

interface NewCommentFormProps {
  newCommentPos: { x: number; y: number } | null;
  newCommentText: string;
  setNewCommentText: (text: string) => void;
  setNewCommentPos: (pos: { x: number; y: number } | null) => void;
  handleCreateComment: (text: string) => void;
  scale: number;
  position: { x: number; y: number };
}

export function NewCommentForm({
  newCommentPos,
  newCommentText,
  setNewCommentText,
  setNewCommentPos,
  handleCreateComment,
  scale,
  position,
}: NewCommentFormProps) {
  if (!newCommentPos) return null;

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        left: newCommentPos.x * scale + position.x,
        top: newCommentPos.y * scale + position.y,
        transform: 'translate(-12px, 12px)',
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-xl)',
        padding: '10px',
        width: '220px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 99999,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <textarea
        value={newCommentText}
        onChange={(e) => setNewCommentText(e.target.value)}
        placeholder="Write a comment..."
        autoFocus
        style={{
          width: '100%',
          minHeight: '60px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '6px',
          padding: '6px 8px',
          color: '#fff',
          fontSize: '12px',
          outline: 'none',
          resize: 'none',
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleCreateComment(newCommentText);
          }
          if (e.key === 'Escape') {
            setNewCommentPos(null);
          }
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
        <button
          onClick={() => setNewCommentPos(null)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            fontSize: '11px',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => handleCreateComment(newCommentText)}
          style={{
            backgroundColor: 'var(--color-accent-primary)',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 10px',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Post
        </button>
      </div>
    </div>
  );
}
