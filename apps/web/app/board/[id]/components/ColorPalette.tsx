import React from 'react';

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', 
  '#6366f1', '#8b5cf6', '#ec4899', '#f3f4f6', '#9ca3af', '#1f2937',
];

interface ColorPaletteProps {
  color: string;
  setColor: (c: string) => void;
}

export default function ColorPalette({ color, setColor }: ColorPaletteProps) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>Color</span>
      <div style={styles.colorPalette}>
        {PRESET_COLORS.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            style={{
              ...styles.presetColorBtn,
              backgroundColor: c,
              border: color === c ? '2px solid #fff' : '1px solid var(--color-border)',
              outline: color === c ? '2px solid var(--color-accent-primary)' : 'none',
              outlineOffset: '1px',
              transform: color === c ? 'scale(1.2)' : 'scale(1)'
            }}
            title={c}
          />
        ))}
        <div style={{
          ...styles.customColorWrap,
          border: !PRESET_COLORS.includes(color) ? '2px solid #fff' : '1px solid var(--color-border)',
          outline: !PRESET_COLORS.includes(color) ? '2px solid var(--color-accent-primary)' : 'none',
          outlineOffset: '1px',
          transform: !PRESET_COLORS.includes(color) ? 'scale(1.2)' : 'scale(1)',
          transition: 'all 0.15s ease',
        }}>
          <input 
            type="color" 
            value={color}
            onChange={e => setColor(e.target.value)}
            style={styles.customColorInput}
            title="Custom color" 
          />
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  row: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 },
  colorPalette: { display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '4px 0' },
  presetColorBtn: { width: '20px', height: '20px', borderRadius: '50%', cursor: 'pointer', padding: 0, transition: 'all 0.15s ease' },
  customColorWrap: { position: 'relative', width: '20px', height: '20px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--color-border)' },
  customColorInput: { position: 'absolute', top: '-10px', left: '-10px', width: '40px', height: '40px', cursor: 'pointer' }
};
