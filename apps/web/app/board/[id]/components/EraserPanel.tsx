import React from 'react';

interface EraserPanelProps {
  eraserWidth: number;
  setEraserWidth: (w: number) => void;
}

export default function EraserPanel({
  eraserWidth,
  setEraserWidth
}: EraserPanelProps) {
  return (
    <div className="glass" style={styles.contextPanel}>
      <span style={styles.contextTitle}>Eraser Width</span>
      <div style={styles.btnGroup}>
        {([8, 16, 32, 64] as const).map(w => {
          const visualSize = w === 8 ? 6 : w === 16 ? 10 : w === 32 ? 16 : 24;
          return (
            <button
              key={w}
              onClick={() => setEraserWidth(w)}
              style={{
                ...styles.circleSizeBtn,
                backgroundColor: eraserWidth === w ? 'var(--color-bg-elevated)' : 'transparent',
                border: eraserWidth === w ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
              }}
              title={`Eraser ${w}px`}
            >
              <div style={{
                width: `${visualSize}px`,
                height: `${visualSize}px`,
                borderRadius: '50%',
                backgroundColor: 'currentColor',
              }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  contextPanel: { padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '220px', pointerEvents: 'auto', alignSelf: 'flex-start', boxShadow: 'var(--shadow-md)' },
  contextTitle: { fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' },
  btnGroup: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  circleSizeBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--color-text-secondary)', transition: 'var(--transition-fast)' }
};
