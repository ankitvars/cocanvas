import React from 'react';
import { Type, Square, Circle as CircleIcon, Minus, Trash2, Bold, Type as TypeIcon, Lock, Unlock } from 'lucide-react';
import { Shape } from '@cocanvas/shared';

interface FloatingToolbarProps {
  shape: Shape;
  onUpdate: (id: string, updates: Partial<Shape>) => void;
  onDelete: (id: string) => void;
  scale: number;
  position: { x: number; y: number };
}

const PRESET_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Yellow
  '#10b981', // Green
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#ffffff', // White
  '#000000', // Black
];

export default function FloatingToolbar({
  shape,
  onUpdate,
  onDelete,
  scale,
  position
}: FloatingToolbarProps) {
  
  // Calculate screen position
  // We want to place it slightly above the shape.
  let shapeScreenX = shape.x * scale + position.x;
  let shapeScreenY = shape.y * scale + position.y;

  // Handle center-based shapes
  if (shape.type === 'ellipse' || shape.type === 'circle' || shape.type === 'triangle' || shape.type === 'diamond') {
    const rx = Math.abs(shape.width / 2) * scale;
    const ry = Math.abs(shape.height / 2) * scale;
    shapeScreenX += rx; // Move to center for X (roughly)
    // Keep Y at top edge
  }

  const topOffset = Math.max(shapeScreenY - 60, 80); // Keep it below main header
  
  return (
    <div className="glass" style={{
      ...styles.container,
      left: Math.max(shapeScreenX, 20), // don't go off left screen
      top: topOffset,
    }}>
      {/* Properties based on shape type (only if not locked) */}
      {!shape.locked && (
        <>
          {/* Color Selection (for most shapes) */}
          {shape.type !== 'image' && (
            <div style={styles.section}>
              <div style={styles.colorPalette}>
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => onUpdate(shape.id, { stroke: c, fill: (shape.type !== 'freehand' && shape.type !== 'line' && shape.type !== 'arrow' && shape.type !== 'text') ? c : 'transparent' })}
                    style={{
                      ...styles.presetColorBtn,
                      backgroundColor: c,
                      border: shape.stroke === c ? '2px solid var(--color-accent-primary)' : '1px solid var(--color-border)'
                    }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Stroke Width / Dash (Lines & Shapes) */}
          {(shape.type === 'rectangle' || shape.type === 'ellipse' || shape.type === 'circle' || shape.type === 'triangle' || shape.type === 'diamond' || shape.type === 'line' || shape.type === 'freehand' || shape.type === 'arrow') && (
            <>
              <div style={styles.divider} />
              <div style={styles.section}>
                <div style={styles.btnGroup}>
                  {([2, 4, 8, 12] as const).map(w => (
                    <button
                      key={w}
                      onClick={() => onUpdate(shape.id, { strokeWidth: w })}
                      style={{
                        ...styles.iconBtn,
                        backgroundColor: shape.strokeWidth === w ? 'var(--color-bg-elevated)' : 'transparent',
                        border: shape.strokeWidth === w ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
                      }}
                      title={`${w}px Width`}
                    >
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>{w}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Dash Option (Line / Freehand / Shapes!) */}
          {(shape.type === 'rectangle' || shape.type === 'ellipse' || shape.type === 'circle' || shape.type === 'triangle' || shape.type === 'diamond' || shape.type === 'line' || shape.type === 'freehand' || shape.type === 'arrow') && (
            <>
              <div style={styles.divider} />
              <div style={styles.section}>
                <div style={styles.btnGroup}>
                  <button
                    onClick={() => onUpdate(shape.id, { dash: undefined })}
                    style={{
                      ...styles.iconBtn,
                      backgroundColor: !shape.dash ? 'var(--color-bg-elevated)' : 'transparent',
                      border: !shape.dash ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
                      width: '36px'
                    }}
                    title="Solid"
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={() => onUpdate(shape.id, { dash: [12, 12] })}
                    style={{
                      ...styles.iconBtn,
                      backgroundColor: (shape.dash && shape.dash[0] > 1) ? 'var(--color-bg-elevated)' : 'transparent',
                      border: (shape.dash && shape.dash[0] > 1) ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
                      width: '36px'
                    }}
                    title="Dashed"
                  >
                    <div style={{ width: '14px', borderTop: '2px dashed currentColor' }} />
                  </button>
                  <button
                    onClick={() => onUpdate(shape.id, { dash: [1, 10] })}
                    style={{
                      ...styles.iconBtn,
                      backgroundColor: (shape.dash && shape.dash[0] === 1) ? 'var(--color-bg-elevated)' : 'transparent',
                      border: (shape.dash && shape.dash[0] === 1) ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
                      width: '36px'
                    }}
                    title="Dotted"
                  >
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                      <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
                      <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
                      <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Text Options */}
          {shape.type === 'text' && (
            <>
              <div style={styles.divider} />
              <div style={styles.section}>
                <div style={styles.btnGroup}>
                  {([16, 24, 32, 48] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => onUpdate(shape.id, { fontSize: s } as any)}
                      style={{
                        ...styles.iconBtn,
                        backgroundColor: (shape as any).fontSize === s ? 'var(--color-bg-elevated)' : 'transparent',
                        border: (shape as any).fontSize === s ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
                      }}
                      title={`Size ${s}`}
                    >
                      <TypeIcon size={s === 16 ? 12 : s === 24 ? 14 : s === 32 ? 16 : 18} />
                    </button>
                  ))}
                </div>
              </div>
              <div style={styles.divider} />
              <div style={styles.section}>
                <button
                  onClick={() => onUpdate(shape.id, { fontWeight: (shape as any).fontWeight === 'bold' ? 'normal' : 'bold' } as any)}
                  style={{
                    ...styles.iconBtn,
                    backgroundColor: (shape as any).fontWeight === 'bold' ? 'var(--color-bg-elevated)' : 'transparent',
                    border: (shape as any).fontWeight === 'bold' ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
                  }}
                  title="Bold"
                >
                  <Bold size={14} />
                </button>
              </div>
            </>
          )}

          {/* Delete */}
          <div style={styles.divider} />
          <div style={styles.section}>
            <button
              onClick={() => onDelete(shape.id)}
              style={{ ...styles.iconBtn, color: 'var(--color-danger)' }}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </>
      )}

      {/* Lock / Unlock (Always visible) */}
      <div style={styles.divider} />
      <div style={styles.section}>
        <button
          onClick={() => onUpdate(shape.id, { locked: !shape.locked })}
          style={{
            ...styles.iconBtn,
            color: shape.locked ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
          }}
          title={shape.locked ? "Unlock Shape" : "Lock Shape"}
        >
          {shape.locked ? <Lock size={16} /> : <Unlock size={16} />}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'absolute',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    padding: '6px',
    borderRadius: 'var(--radius-md)',
    gap: '6px',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-secondary)',
    backdropFilter: 'blur(20px)',
    transform: 'translateY(-10px)',
    transition: 'top 0.1s ease, left 0.1s ease',
  },
  section: {
    display: 'flex',
    alignItems: 'center',
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: 'var(--color-border)',
  },
  colorPalette: {
    display: 'flex',
    gap: '4px',
  },
  presetColorBtn: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    cursor: 'pointer',
    padding: 0,
    transition: 'transform 0.1s',
  },
  btnGroup: {
    display: 'flex',
    gap: '4px',
  },
  iconBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    transition: 'var(--transition-fast)',
  }
};
