import React from 'react';
import ColorPalette from './ColorPalette';

interface LinePanelProps {
  color: string;
  setColor: (c: string) => void;
  strokeWidth: number;
  setStrokeWidth: (w: number) => void;
  penStyle: 'solid' | 'dashed' | 'dotted';
  setPenStyle: (s: 'solid' | 'dashed' | 'dotted') => void;
}

export default function LinePanel({
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  penStyle,
  setPenStyle
}: LinePanelProps) {
  return (
    <div className="glass" style={styles.contextPanel}>
      <span style={styles.contextTitle}>Line Properties</span>
      <div style={styles.row}>
        <span style={styles.label}>Size</span>
        <div style={styles.btnGroup}>
          {([2, 4, 8, 12, 16] as const).map(w => (
            <button
              key={w}
              onClick={() => setStrokeWidth(w)}
              style={{
                ...styles.circleSizeBtn,
                backgroundColor: strokeWidth === w ? 'var(--color-bg-elevated)' : 'transparent',
                border: strokeWidth === w ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
              }}
              title={`${w}px`}
            >
              <div style={{
                width: `${Math.max(w, 4)}px`,
                height: `${Math.max(w, 4)}px`,
                borderRadius: '50%',
                backgroundColor: 'currentColor',
              }} />
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ ...styles.row, marginTop: '12px' }}>
        <span style={styles.label}>Dash</span>
        <div style={styles.btnGroup}>
          <button
            onClick={() => setPenStyle('solid')}
            style={{
              ...styles.circleSizeBtn,
              flex: 1,
              backgroundColor: penStyle === 'solid' ? 'var(--color-bg-elevated)' : 'transparent',
              border: penStyle === 'solid' ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
            }}
            title="Solid"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="2" y1="12" x2="22" y2="12" strokeLinecap="round" /></svg>
          </button>
          <button
            onClick={() => setPenStyle('dashed')}
            style={{
              ...styles.circleSizeBtn,
              flex: 1,
              backgroundColor: penStyle === 'dashed' ? 'var(--color-bg-elevated)' : 'transparent',
              border: penStyle === 'dashed' ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
            }}
            title="Dashed"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="2" y1="12" x2="22" y2="12" strokeDasharray="5,5" strokeLinecap="round" /></svg>
          </button>
          <button
            onClick={() => setPenStyle('dotted')}
            style={{
              ...styles.circleSizeBtn,
              flex: 1,
              backgroundColor: penStyle === 'dotted' ? 'var(--color-bg-elevated)' : 'transparent',
              border: penStyle === 'dotted' ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
            }}
            title="Dotted"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="2" y1="12" x2="22" y2="12" strokeDasharray="1,5" strokeLinecap="round" /></svg>
          </button>
        </div>
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
  row: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 },
  btnGroup: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  circleSizeBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--color-text-secondary)', transition: 'var(--transition-fast)' }
};
