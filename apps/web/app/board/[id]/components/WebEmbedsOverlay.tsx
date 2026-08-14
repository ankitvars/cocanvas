'use client';
import React, { useState, useRef, useCallback } from 'react';
import { Shape } from '@cocanvas/shared';
import { Link, X, GripHorizontal, ExternalLink } from 'lucide-react';

interface WebEmbedsOverlayProps {
  shapes: Shape[];
  scale: number;
  position: { x: number; y: number };
  selectedShapeId: string | null;
  onUpdate: (id: string, updates: Partial<Shape>) => void;
}

// ── URL Edit Modal ────────────────────────────────────────────────────────────
function UrlModal({
  initialUrl,
  onConfirm,
  onClose,
}: {
  initialUrl: string;
  onConfirm: (url: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(initialUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: '420px',
          backgroundColor: 'rgb(15, 23, 42)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              backgroundColor: 'rgba(99,102,241,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Link size={15} color="var(--color-accent-primary)" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
              Set Embed URL
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            URL to embed
          </label>
          <input
            ref={inputRef}
            autoFocus
            type="url"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onConfirm(value);
              if (e.key === 'Escape') onClose();
            }}
            placeholder="https://example.com"
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'monospace',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.currentTarget.style.border = '1px solid var(--color-accent-primary)')}
            onBlur={(e) => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)')}
          />
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            Supports: websites, YouTube, Google Maps, Figma, etc.
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'transparent', color: 'var(--color-text-secondary)',
              cursor: 'pointer', fontSize: '13px', fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(value)}
            style={{
              padding: '8px 20px', borderRadius: '8px', border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
            }}
          >
            Embed
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Resize Handle ─────────────────────────────────────────────────────────────
function ResizeHandle({
  embedId,
  currentW,
  currentH,
  scale,
  onUpdate,
}: {
  embedId: string;
  currentW: number;
  currentH: number;
  scale: number;
  onUpdate: (id: string, updates: any) => void;
}) {
  const startRef = useRef<{ mx: number; my: number; w: number; h: number } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startRef.current = { mx: e.clientX, my: e.clientY, w: currentW, h: currentH };

    const onMove = (me: PointerEvent) => {
      if (!startRef.current) return;
      const dx = (me.clientX - startRef.current.mx) / scale;
      const dy = (me.clientY - startRef.current.my) / scale;
      onUpdate(embedId, {
        width: Math.max(180, startRef.current.w + dx),
        height: Math.max(120, startRef.current.h + dy),
      });
    };
    const onUp = () => {
      startRef.current = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [embedId, currentW, currentH, scale, onUpdate]);

  return (
    <div
      onPointerDown={onPointerDown}
      title="Drag to resize"
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '20px',
        height: '20px',
        cursor: 'se-resize',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.35)',
        backgroundColor: 'rgba(15,23,42,0.7)',
        borderRadius: '4px 0 6px 0',
        zIndex: 2,
      }}
    >
      <GripHorizontal size={11} style={{ transform: 'rotate(45deg)' }} />
    </div>
  );
}

function getEmbeddableUrl(url: string): string {
  if (!url) return '';
  try {
    let cleanUrl = url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = 'https://' + cleanUrl;
    }
    const parsed = new URL(cleanUrl);
    if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
      let videoId = '';
      if (parsed.hostname.includes('youtu.be')) {
        videoId = parsed.pathname.substring(1);
      } else {
        const vParam = parsed.searchParams.get('v');
        if (vParam) videoId = vParam;
        else if (parsed.pathname.startsWith('/embed/')) return cleanUrl;
      }
      if (videoId) {
        const t = parsed.searchParams.get('t') || parsed.searchParams.get('start');
        const startQuery = t ? `?start=${t.replace('s', '')}` : '';
        return `https://www.youtube.com/embed/${videoId}${startQuery}`;
      }
    }
    if (parsed.hostname.includes('vimeo.com')) {
      const match = parsed.pathname.match(/^\/(\d+)/);
      if (match) return `https://player.vimeo.com/video/${match[1]}`;
    }
    if (parsed.hostname.includes('figma.com') && !parsed.pathname.startsWith('/embed')) {
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(cleanUrl)}`;
    }
    if (parsed.hostname.includes('spotify.com') && !parsed.pathname.includes('/embed')) {
      return cleanUrl.replace('spotify.com/', 'spotify.com/embed/');
    }
    return cleanUrl;
  } catch (e) {
    return url;
  }
}

// ── Main Overlay ──────────────────────────────────────────────────────────────
export default function WebEmbedsOverlay({
  shapes,
  scale,
  position,
  selectedShapeId,
  onUpdate,
}: WebEmbedsOverlayProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const embedShapes = shapes.filter((s) => (s.type as string) === 'embed') as any[];
  const editingEmbed = editingId ? embedShapes.find((e) => e.id === editingId) : null;

  return (
    <>
      {embedShapes.map((embed) => {
        const screenX = embed.x * scale + position.x;
        const screenY = embed.y * scale + position.y;
        const screenW = Math.max(embed.width * scale, 200);
        const screenH = Math.max(embed.height * scale, 140);
        const url = embed.src as string;
        const embedUrl = getEmbeddableUrl(url);

        return (
          <div
            key={embed.id}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              left: screenX,
              top: screenY,
              width: screenW,
              height: screenH,
              border:
                selectedShapeId === embed.id
                  ? '2px solid var(--color-accent-primary)'
                  : '1px dashed rgba(255,255,255,0.15)',
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
            {/* Header bar */}
            <div
              style={{
                height: '32px',
                flexShrink: 0,
                backgroundColor: 'rgba(15,23,42,0.95)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 10px',
                fontSize: '11px',
                color: 'var(--color-text-secondary)',
                userSelect: 'none',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  overflow: 'hidden',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Link size={11} style={{ flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: 'monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {url || 'No URL set'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'var(--transition-fast)',
                    }}
                    title="Open in new tab"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }}
                  >
                    <ExternalLink size={11} />
                  </a>
                )}
                <button
                  onClick={() => setEditingId(embed.id)}
                  style={{
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '11px',
                    transition: 'var(--transition-fast)',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.25)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)')
                  }
                >
                  Edit URL
                </button>
              </div>
            </div>

            {/* Embed content */}
            <div style={{ flex: 1, backgroundColor: '#000', position: 'relative', overflow: 'hidden' }}>
              {url ? (
                <iframe
                  src={embedUrl}
                  style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#fff' }}
                  title={`Embed ${embed.id}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    color: 'var(--color-text-muted)',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => setEditingId(embed.id)}
                >
                  <span style={{ fontSize: '28px' }}>🌐</span>
                  <span style={{ fontSize: '12px' }}>Click "Edit URL" in the header to set the embed URL</span>
                </div>
              )}

              {/* SE resize handle */}
              <ResizeHandle
                embedId={embed.id}
                currentW={embed.width}
                currentH={embed.height}
                scale={scale}
                onUpdate={onUpdate}
              />
            </div>
          </div>
        );
      })}

      {/* URL edit modal */}
      {editingEmbed && (
        <UrlModal
          initialUrl={editingEmbed.src || ''}
          onConfirm={(newUrl) => {
            onUpdate(editingEmbed.id, { src: newUrl } as any);
            setEditingId(null);
          }}
          onClose={() => setEditingId(null)}
        />
      )}
    </>
  );
}
