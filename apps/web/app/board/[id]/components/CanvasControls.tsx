import { useState } from 'react';
import { ZoomIn, ZoomOut, ChevronUp, Grid } from 'lucide-react';

interface CanvasControlsProps {
  handleZoom: (factor: number) => void;
  scale: number;
  setScale: (s: number) => void;
  bgType: 'grid' | 'dots' | 'plain';
  setBgType: (t: 'grid' | 'dots' | 'plain') => void;
  triggerReaction?: (emoji: string) => void;
}

export default function CanvasControls({
  handleZoom,
  scale,
  setScale,
  bgType,
  setBgType,
  triggerReaction,
}: CanvasControlsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showBgMenu, setShowBgMenu] = useState(false);
  const [showReactionMenu, setShowReactionMenu] = useState(false);

  return (
    <div className="glass" style={styles.bottomControls}>
      <button onClick={() => handleZoom(0.8)} style={styles.controlBtn} title="Zoom out">
        <ZoomOut size={16} />
      </button>
      
      <div style={{ position: 'relative' }}>
        <button 
          onClick={() => setShowMenu(!showMenu)} 
          style={{ ...styles.controlBtn, padding: '4px 8px', width: '60px', justifyContent: 'center' }}
          title="Zoom Options"
        >
          <span style={styles.zoomLevel}>{Math.round(scale * 100)}%</span>
        </button>
        
        {showMenu && (
          <div style={styles.zoomDropdown}>
            <button onClick={() => { setScale(1); setShowMenu(false); }} style={styles.dropdownItem}>
              100%
            </button>
            <button onClick={() => { setScale(0.5); setShowMenu(false); }} style={styles.dropdownItem}>
              50%
            </button>
            <button onClick={() => { setScale(2); setShowMenu(false); }} style={styles.dropdownItem}>
              200%
            </button>
            <button onClick={() => { setScale(4); setShowMenu(false); }} style={styles.dropdownItem}>
              400%
            </button>
          </div>
        )}
      </div>

      <button onClick={() => handleZoom(1.2)} style={styles.controlBtn} title="Zoom in">
        <ZoomIn size={16} />
      </button>

      <div style={styles.controlDivider} />

      <div style={{ position: 'relative' }}>
        <button 
          onClick={() => setShowBgMenu(!showBgMenu)} 
          style={styles.controlBtn}
          title="Background Options"
        >
          <Grid size={16} />
        </button>
        
        {showBgMenu && (
          <div style={styles.zoomDropdown}>
            <button onClick={() => { setBgType('grid'); setShowBgMenu(false); }} style={styles.dropdownItem}>
              Grid
            </button>
            <button onClick={() => { setBgType('dots'); setShowBgMenu(false); }} style={styles.dropdownItem}>
              Dots
            </button>
            <button onClick={() => { setBgType('plain'); setShowBgMenu(false); }} style={styles.dropdownItem}>
              Plain
            </button>
          </div>
        )}
      </div>

      <div style={styles.controlDivider} />

      <div style={{ position: 'relative' }}>
        <button 
          onClick={() => setShowReactionMenu(!showReactionMenu)} 
          style={styles.controlBtn}
          title="Reactions (E)"
        >
          <span style={{ fontSize: '14px' }}>😊</span>
        </button>
        
        {showReactionMenu && (
          <div style={{
            ...styles.zoomDropdown,
            flexDirection: 'row',
            bottom: 'calc(100% + 10px)',
            padding: '4px',
            gap: '4px',
            minWidth: 'auto',
          }}>
            {['👍', '❤️', '🎉', '😮', '🔥', '👏'].map(emoji => (
              <button 
                key={emoji}
                onClick={() => {
                  triggerReaction?.(emoji);
                  setShowReactionMenu(false);
                }}
                style={{
                  ...styles.dropdownItem,
                  padding: '6px',
                  fontSize: '16px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bottomControls: { 
    position: 'absolute', 
    left: '20px', 
    bottom: '20px', 
    height: '40px',
    padding: '0 12px', 
    borderRadius: 'var(--radius-md)', 
    display: 'flex',
    alignItems: 'center', 
    gap: '10px', 
    zIndex: 10 
  },
  controlBtn: { 
    color: 'var(--color-text-secondary)', 
    cursor: 'pointer',
    display: 'flex', 
    alignItems: 'center', 
    padding: '4px' 
  },
  controlDivider: { 
    height: '60%', 
    width: '1px', 
    backgroundColor: 'var(--color-border)' 
  },
  zoomLevel: { 
    fontSize: '12px', 
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    textAlign: 'center' 
  },
  zoomDropdown: {
    position: 'absolute',
    bottom: 'calc(100% + 10px)', // Show above the controls
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '80px',
    overflow: 'hidden',
    zIndex: 20
  },
  dropdownItem: {
    padding: '8px 12px',
    cursor: 'pointer',
    color: 'var(--color-text-primary)',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 500,
    width: '100%',
    transition: 'var(--transition-fast)'
  }
};
