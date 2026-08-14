import React from 'react';
import { Square, Circle as CircleIcon, Triangle } from 'lucide-react';
import ColorPalette from './ColorPalette';

interface ShapePanelProps {
  selectedSubShape: 'rectangle' | 'square' | 'rounded_rect' | 'ellipse' | 'circle' | 'triangle' | 'diamond';
  setSelectedSubShape: (s: any) => void;
  setTool: (t: any) => void;
  color: string;
  setColor: (c: string) => void;
  shapeStrokeWidth: number;
  setShapeStrokeWidth: (w: number) => void;
}

export default function ShapePanel({
  selectedSubShape,
  setSelectedSubShape,
  setTool,
  color,
  setColor,
  shapeStrokeWidth,
  setShapeStrokeWidth,
}: ShapePanelProps) {
  return (
    <div className="glass" style={styles.contextPanel}>
      <span style={styles.contextTitle}>Shapes</span>
      <div style={styles.contextGrid}>
        {([
          ['rectangle', 'Rectangle', <Square size={16} key="rect" />],
          ['rounded_rect', 'Rounded', <svg key="rounded" width="16" height="16" viewBox="0 0 16 16"><rect width="14" height="10" x="1" y="3" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /></svg>],
          ['square', 'Square', <Square key="square" style={{ transform: 'scale(0.85)' }} size={16} />],
          ['ellipse', 'Ellipse', <svg key="ellipse" width="16" height="16" viewBox="0 0 16 16"><ellipse cx="8" cy="8" rx="7" ry="4" fill="none" stroke="currentColor" strokeWidth="2" /></svg>],
          ['circle', 'Circle', <CircleIcon key="circle" style={{ transform: 'scale(0.85)' }} size={16} />],
          ['triangle', 'Triangle', <Triangle key="triangle" size={16} />],
          ['diamond', 'Diamond', <Square key="diamond" style={{ transform: 'rotate(45deg) scale(0.75)' }} size={16} />],
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
              {icon}
            </div>
            <span style={{ fontSize: '11px' }}>{label}</span>
          </button>
        ))}
      </div>

      <div style={styles.divider} />

      {/* Border / Stroke Width Row */}
      <div style={styles.row}>
        <span style={styles.label}>Border Width</span>
        <div style={styles.btnGroup}>
          {([1, 2, 4, 6, 8] as const).map((w) => (
            <button
              key={w}
              onClick={() => setShapeStrokeWidth(w)}
              title={`${w}px`}
              style={{
                ...styles.widthBtn,
                backgroundColor: shapeStrokeWidth === w ? 'var(--color-bg-elevated)' : 'transparent',
                border: shapeStrokeWidth === w ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
              }}
            >
              <div style={{
                width: '22px',
                height: `${Math.max(w, 1)}px`,
                backgroundColor: 'currentColor',
                borderRadius: '1px',
              }} />
            </button>
          ))}
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
  contextGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' },
  contextBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--color-text-secondary)', transition: 'var(--transition-fast)' },
  row: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 },
  btnGroup: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  widthBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '32px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--color-text-secondary)', transition: 'var(--transition-fast)' },
};
