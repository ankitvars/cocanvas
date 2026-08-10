import React from 'react';
import ColorPalette from './ColorPalette';

interface TextPanelProps {
  fontSize: number;
  setFontSize: (s: number) => void;
  fontWeight: string;
  setFontWeight: (w: string) => void;
  color: string;
  setColor: (c: string) => void;
}

export default function TextPanel({
  fontSize,
  setFontSize,
  fontWeight,
  setFontWeight,
  color,
  setColor
}: TextPanelProps) {
  return (
    <div className="glass" style={styles.contextPanel}>
      <span style={styles.contextTitle}>Text Properties</span>
      <div style={styles.row}>
        <span style={styles.label}>Size</span>
        <div style={styles.btnGroup}>
          {([16, 24, 32, 48] as const).map(s => (
            <button
              key={s}
              onClick={() => setFontSize(s)}
              style={{
                ...styles.pillBtn,
                backgroundColor: fontSize === s ? 'var(--color-bg-elevated)' : 'transparent',
                border: fontSize === s ? '1px solid var(--color-accent-primary)' : '1px solid var(--color-border)',
              }}
            >
              {s === 16 ? 'S' : s === 24 ? 'M' : s === 32 ? 'L' : 'XL'}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ ...styles.row, marginTop: '12px' }}>
        <span style={styles.label}>Style</span>
        <div style={styles.btnGroup}>
          <button
            onClick={() => setFontWeight('normal')}
            style={{
              ...styles.pillBtn,
              flex: 1,
              backgroundColor: fontWeight === 'normal' ? 'var(--color-bg-elevated)' : 'transparent',
              border: fontWeight === 'normal' ? '1px solid var(--color-accent-primary)' : '1px solid var(--color-border)',
              fontWeight: 'normal',
            }}
          >
            Normal
          </button>
          <button
            onClick={() => setFontWeight('bold')}
            style={{
              ...styles.pillBtn,
              flex: 1,
              backgroundColor: fontWeight === 'bold' ? 'var(--color-bg-elevated)' : 'transparent',
              border: fontWeight === 'bold' ? '1px solid var(--color-accent-primary)' : '1px solid var(--color-border)',
              fontWeight: 'bold',
            }}
          >
            Bold
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
  pillBtn: { padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', cursor: 'pointer', transition: 'var(--transition-fast)' }
};
