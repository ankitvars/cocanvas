import React from 'react';
import ColorPalette from './ColorPalette';
import { PaintBucket } from 'lucide-react';

interface BucketPanelProps {
  color: string;
  setColor: (c: string) => void;
}

export default function BucketPanel({ color, setColor }: BucketPanelProps) {
  return (
    <div className="glass" style={styles.panel}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.iconWrap}>
          <PaintBucket size={14} color="var(--color-accent-primary)" />
        </div>
        <span style={styles.title}>Bucket Fill</span>
      </div>

      {/* Instructions */}
      <div style={styles.instructions}>
        <p style={styles.hint}>
          Choose a fill color below, then click any shape on the canvas to apply it.
        </p>
        {/* Color swatch preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: color,
              border: '2px solid rgba(255,255,255,0.15)',
              boxShadow: `0 0 12px ${color}55`,
              flexShrink: 0,
            }}
          />
          <div>
            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>Active fill color</p>
            <p style={{ fontSize: '12px', color: '#fff', fontFamily: 'monospace', margin: '2px 0 0' }}>
              {color.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      <div style={styles.divider} />

      <ColorPalette color={color} setColor={setColor} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: '220px',
    pointerEvents: 'auto',
    alignSelf: 'flex-start',
    boxShadow: 'var(--shadow-md)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  iconWrap: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    backgroundColor: 'rgba(99,102,241,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    color: 'var(--color-text-muted)',
  },
  instructions: {
    backgroundColor: 'rgba(99,102,241,0.06)',
    border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: '8px',
    padding: '10px 12px',
  },
  hint: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
    margin: 0,
    lineHeight: 1.5,
  },
  divider: {
    width: '60%',
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '4px 0',
  },
};
