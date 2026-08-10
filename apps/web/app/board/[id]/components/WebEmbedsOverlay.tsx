import React from 'react';
import { Shape } from '@cocanvas/shared';

interface WebEmbedsOverlayProps {
  shapes: Shape[];
  scale: number;
  position: { x: number; y: number };
  selectedShapeId: string | null;
  onUpdate: (id: string, updates: Partial<Shape>) => void;
}

export default function WebEmbedsOverlay({
  shapes,
  scale,
  position,
  selectedShapeId,
  onUpdate,
}: WebEmbedsOverlayProps) {
  return (
    <>
      {shapes.filter(s => (s.type as string) === 'embed').map((embedShape) => {
        const embed = embedShape as any;
        const screenX = embed.x * scale + position.x;
        const screenY = embed.y * scale + position.y;
        const screenW = embed.width * scale;
        const screenH = embed.height * scale;
        const url = embed.src;

        return (
          <div
            key={embed.id}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              left: screenX,
              top: screenY,
              width: Math.max(screenW, 100),
              height: Math.max(screenH, 80),
              border: selectedShapeId === embed.id ? '2px solid var(--color-accent-primary)' : '1px dashed rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: selectedShapeId === embed.id ? 1000 : 10,
              overflow: 'hidden',
              pointerEvents: 'auto',
            }}
          >
            {/* Header Overlay */}
            <div
              style={{
                height: '32px',
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 10px',
                fontSize: '11px',
                color: 'var(--color-text-secondary)',
                userSelect: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                <span>🔗</span>
                <span style={{ fontFamily: 'monospace' }}>{url || 'No URL'}</span>
              </div>
              <button
                onClick={() => {
                  const newUrl = prompt('Enter URL to embed:', url || '');
                  if (newUrl !== null) {
                    onUpdate(embed.id, { src: newUrl } as any);
                  }
                }}
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-border)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)'}
              >
                Edit
              </button>
            </div>

            {/* Embed Content */}
            <div style={{ flex: 1, backgroundColor: '#000', position: 'relative' }}>
              {url ? (
                <iframe
                  src={url}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    backgroundColor: '#fff',
                  }}
                  title={`Embed ${embed.id}`}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--color-text-muted)', padding: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '24px' }}>🌐</span>
                  <span style={{ fontSize: '12px' }}>Click "Edit" above to set iframe URL</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
