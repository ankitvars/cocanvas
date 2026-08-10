import React from 'react';

interface EmojiPickerOverlayProps {
  showEmojiPicker: boolean;
  pickerPos: { x: number; y: number };
  broadcastReaction: (emoji: string) => void;
  setShowEmojiPicker: (show: boolean) => void;
}

export default function EmojiPickerOverlay({
  showEmojiPicker,
  pickerPos,
  broadcastReaction,
  setShowEmojiPicker,
}: EmojiPickerOverlayProps) {
  if (!showEmojiPicker) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        left: pickerPos.x - 70,
        top: pickerPos.y - 45,
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '6px 10px',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        gap: '8px',
        zIndex: 999999,
        pointerEvents: 'auto',
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {['🔥', '✨', '💖', '👍', '👎', '🎉'].map(emoji => (
        <button
          key={emoji}
          onClick={() => {
            broadcastReaction(emoji);
            setShowEmojiPicker(false);
          }}
          style={{
            fontSize: '18px',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: 'transparent',
            padding: '2px',
            borderRadius: '50%',
            transition: 'transform 0.1s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
