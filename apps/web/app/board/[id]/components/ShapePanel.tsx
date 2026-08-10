import React from 'react';
import { Square, Circle as CircleIcon, Triangle } from 'lucide-react';
import ColorPalette from './ColorPalette';

interface ShapePanelProps {
  selectedSubShape: 'rectangle' | 'square' | 'rounded_rect' | 'ellipse' | 'circle' | 'triangle' | 'diamond';
  setSelectedSubShape: (s: any) => void;
  setTool: (t: any) => void;
  color: string;
  setColor: (c: string) => void;
}

export default function ShapePanel({
  selectedSubShape,
  setSelectedSubShape,
  setTool,
  color,
  setColor
}: ShapePanelProps) {
  return (
    <div className="glass" style={styles.contextPanel}>
      <span style={styles.contextTitle}>Shapes</span>
      <div style={styles.contextGrid}>
        {([
          ['rectangle', 'Rectangle', <Square size={16} />],
          ['rounded_rect', 'Rounded', <svg width="16" height="16" viewBox="0 0 16 16"><rect width="14" height="10" x="1" y="3" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /></svg>],
          ['square', 'Square', <Square style={{ transform: 'scale(0.85)' }} size={16} />],
          ['ellipse', 'Ellipse', <svg width="16" height="16" viewBox="0 0 16 16"><ellipse cx="8" cy="8" rx="7" ry="4" fill="none" stroke="currentColor" strokeWidth="2" /></svg>],
          ['circle', 'Circle', <CircleIcon style={{ transform: 'scale(0.85)' }} size={16} />],
          ['triangle', 'Triangle', <Triangle size={16} />],
          ['diamond', 'Diamond', <Square style={{ transform: 'rotate(45deg) scale(0.75)' }} size={16} />],
        ] as const).map(([s, label, icon]) => (
          <button
            key={s}
            title={label}
            onClick={() => {
              setSelectedSubShape(s);
              setTool(s);
            }}
            style={{
              ...styles.contextBtn,
              backgroundColor: selectedSubShape === s ? 'var(--color-bg-elevated)' : 'transparent',
              border: selectedSubShape === s ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
            }}
          >
            <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {typeof icon === 'string' ? null : icon}
            </div>
            <span style={{ fontSize: '11px' }}>{label}</span>
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
  contextGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' },
  contextBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--color-text-secondary)', transition: 'var(--transition-fast)' }
};
