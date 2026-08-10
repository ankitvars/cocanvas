import React from 'react';
import ColorPalette from './ColorPalette';

interface ArrowPanelProps {
  arrowDirection: 'right' | 'both';
  setArrowDirection: (d: 'right' | 'both') => void;
  color: string;
  setColor: (c: string) => void;
}

export default function ArrowPanel({
  arrowDirection,
  setArrowDirection,
  color,
  setColor
}: ArrowPanelProps) {
  return (
    <div className="glass" style={styles.contextPanel}>
      <span style={styles.contextTitle}>Arrow Head pointing</span>
      <div style={styles.btnGroup}>
        {([
          ['right', 'Single (->)'],
          ['both', 'Double (<->)'],
        ] as const).map(([dir, label]) => (
          <button
            key={dir}
            onClick={() => setArrowDirection(dir)}
            style={{
              ...styles.pillBtn,
              flex: 1,
              backgroundColor: arrowDirection === dir ? 'var(--color-bg-elevated)' : 'transparent',
              border: arrowDirection === dir ? '1px solid var(--color-accent-primary)' : '1px solid var(--color-border)',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      
      <div style={styles.divider} />
      <ColorPalette color={color} setColor={setColor} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  divider: { width: '60%', height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' },
  contextPanel: { padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '220px', pointerEvents: 'auto', alignSelf: 'flex-start', boxShadow: 'var(--shadow-md)' },
  contextTitle: { fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' },
  btnGroup: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  pillBtn: { padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', cursor: 'pointer', transition: 'var(--transition-fast)' }
};
