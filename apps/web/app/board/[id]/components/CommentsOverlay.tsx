import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface CommentsOverlayProps {
  comments: any[];
  scale: number;
  position: { x: number; y: number };
  activeCommentId: string | null;
  setActiveCommentId: (id: string | null) => void;
  collapsedCommentIds: string[];
  setCollapsedCommentIds: React.Dispatch<React.SetStateAction<string[]>>;
  hoveredCommentId: string | null;
  setHoveredCommentId: (id: string | null) => void;
  editingCommentId: string | null;
  setEditingCommentId: (id: string | null) => void;
  editingCommentText: string;
  setEditingCommentText: (text: string) => void;
  user: any;
  handleDeleteComment: (id: string) => void;
  handleSaveEditComment: (id: string, text: string) => void;
  getOptimizedAvatarUrl: (url: string, size: number) => string;
}

export default function CommentsOverlay({
  comments,
  scale,
  position,
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
  user,
  handleDeleteComment,
  handleSaveEditComment,
  getOptimizedAvatarUrl,
}: CommentsOverlayProps) {
  return (
    <>
      {comments.map((comment) => {
        const screenX = comment.x * scale + position.x;
        const screenY = comment.y * scale + position.y;
        const isActive = activeCommentId === comment.id;
        const isCollapsed = collapsedCommentIds.includes(comment.id);
        const isOwner = comment.userId === user.id;
        const isEditing = editingCommentId === comment.id;
        
        return (
          <div 
            key={comment.id} 
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseEnter={() => setHoveredCommentId(comment.id)}
            onMouseLeave={() => setHoveredCommentId(null)}
            style={{ 
              position: 'absolute', 
              left: screenX, 
              top: screenY, 
              zIndex: hoveredCommentId === comment.id ? 100000 : (isActive ? 99999 : 999), 
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* The Pin Bubble */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveCommentId(comment.id);
                setCollapsedCommentIds(prev => 
                  isCollapsed ? prev.filter(id => id !== comment.id) : [...prev, comment.id]
                );
                setEditingCommentId(null);
              }}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: isActive ? 'var(--color-accent-primary)' : 'rgba(30, 41, 59, 0.95)',
                border: isActive ? '2px solid #fff' : '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {comment.userAvatar ? (
                <img 
                  src={getOptimizedAvatarUrl(comment.userAvatar, 64)} 
                  alt={comment.userName} 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                />
              ) : (
                <span>💬</span>
              )}
            </button>

            {/* Comment Popover */}
            {!isCollapsed && (
              <div 
                style={{
                  position: 'absolute',
                  top: '36px',
                  left: '14px',
                  width: '240px',
                  backgroundColor: 'rgb(15, 23, 42)',
                  border: isActive ? '1.5px solid var(--color-accent-primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  zIndex: 99999,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCommentId(comment.id);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {comment.userAvatar ? (
                    <img 
                      src={getOptimizedAvatarUrl(comment.userAvatar, 48)} 
                      alt={comment.userName} 
                      style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 600, color: '#fff' }}>
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{comment.userName}</span>
                </div>

                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <textarea
                      value={editingCommentText}
                      onChange={(e) => setEditingCommentText(e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '50px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        color: '#fff',
                        fontSize: '12px',
                        outline: 'none',
                        resize: 'none',
                      }}
                      autoFocus
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: 'var(--color-text-secondary)',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEditComment(comment.id, editingCommentText)}
                        style={{
                          backgroundColor: 'var(--color-accent-primary)',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', textAlign: 'left' }}>
                      {comment.content}
                    </p>
                    {isOwner && (
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditingCommentText(comment.content);
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'var(--transition-fast)',
                          }}
                          title="Edit Comment"
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#f87171',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'var(--transition-fast)',
                          }}
                          title="Delete Comment"
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
