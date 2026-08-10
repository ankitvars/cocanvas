import { useState } from 'react';
import { Square, Circle as CircleIcon, Triangle, Frame, Code2, Compass, Sparkles, PaintBucket, Scissors, MoreHorizontal } from 'lucide-react';
import ToolbarContextPanels from './ToolbarContextPanels';

interface CanvasToolbarProps {
  tool: string;
  setTool: (tool: any) => void;
  selectedSubShape: 'rectangle' | 'square' | 'rounded_rect' | 'ellipse' | 'circle' | 'triangle' | 'diamond';
  setSelectedSubShape: (s: any) => void;
  color: string;
  setColor: (c: string) => void;
  strokeWidth: number;
  setStrokeWidth: (w: number) => void;
  sharpness: 'smooth' | 'sharp';
  setSharpness: (s: 'smooth' | 'sharp') => void;
  penStyle: 'solid' | 'dashed' | 'dotted';
  setPenStyle: (s: 'solid' | 'dashed' | 'dotted') => void;
  fontSize: number;
  setFontSize: (s: number) => void;
  fontWeight: string;
  setFontWeight: (w: string) => void;
  eraserWidth: number;
  setEraserWidth: (w: number) => void;
  arrowDirection: 'right' | 'both';
  setArrowDirection: (d: 'right' | 'both') => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onImageUpload: () => void;
}

export default function CanvasToolbar({
  tool,
  setTool,
  selectedSubShape,
  setSelectedSubShape,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  sharpness,
  setSharpness,
  penStyle,
  setPenStyle,
  fontSize,
  setFontSize,
  fontWeight,
  setFontWeight,
  eraserWidth,
  setEraserWidth,
  arrowDirection,
  setArrowDirection,
  onUndo,
  onRedo,
  onClear,
  onImageUpload,
}: CanvasToolbarProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainTools = [
    { type: 'select', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path></svg>, label: 'Select' },
    { type: 'freehand', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>, label: 'Pen' },
    { type: 'line', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="19" x2="19" y2="5"></line></svg>, label: 'Line' },
    { 
      type: 'shape_menu', 
      icon: selectedSubShape === 'circle' ? <CircleIcon size={18} /> : selectedSubShape === 'triangle' ? <Triangle size={18} /> : <Square size={18} />, 
      label: 'Shapes' 
    },
    { type: 'arrow', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>, label: 'Arrow' },
    { type: 'text', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>, label: 'Text' },
    { type: 'eraser', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16c-1.5-1.5-1.5-3.5 0-5l8.5-8.5c1.5-1.5 3.5-1.5 5 0l4 4c1.5 1.5 1.5 3.5 0 5L12 20"></path><line x1="12" y1="11" x2="20" y2="19"></line></svg>, label: 'Eraser' },
    { type: 'comment', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>, label: 'Comment' }
  ] as const;

  const moreTools = [
    { type: 'frame', icon: <Frame size={16} />, label: 'Frame tool', shortcut: 'Shift-F' },
    { type: 'embed', icon: <Code2 size={16} />, label: 'Web Embed', shortcut: '' },
    { type: 'draw_to_shape', icon: <Compass size={16} />, label: 'Draw to shape', shortcut: 'Shift-X' },
    { type: 'laser', icon: <Sparkles size={16} />, label: 'Laser pointer', shortcut: 'Shift-K' },
    { type: 'bucket', icon: <PaintBucket size={16} />, label: 'Bucket fill', shortcut: 'Shift-B' },
    { type: 'lasso', icon: <Scissors size={16} />, label: 'Lasso selection', shortcut: 'Shift-S' }
  ] as const;

  const shapeTypes = ['rectangle', 'square', 'rounded_rect', 'ellipse', 'circle', 'triangle', 'diamond'];
  const isShapeActive = shapeTypes.includes(tool as any);
  const isMoreToolActive = moreTools.some(mt => mt.type === tool);

  return (
    <div style={styles.container}>
      {/* Main Toolbar */}
      <aside className="glass" style={styles.toolbar}>
        {mainTools.map(({ type, icon, label }) => {
          const isActive = tool === type || (type === 'shape_menu' && isShapeActive);
          return (
            <button 
              key={type} 
              title={label}
              onClick={() => {
                setShowMoreMenu(false);
                if (type === 'shape_menu') {
                  setTool(selectedSubShape);
                } else {
                  setTool(type as any);
                }
              }}
              style={{ 
                ...styles.toolBtn,
                color: isActive ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)'
              }}
            >
              {icon}
            </button>
          );
        })}

        {/* More Tools Trigger */}
        <button
          title="More tools"
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          style={{
            ...styles.toolBtn,
            color: (isMoreToolActive || showMoreMenu) ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)'
          }}
        >
          <MoreHorizontal size={18} />
        </button>

        {/* More Tools Dropdown Menu */}
        {showMoreMenu && (
          <div 
            className="glass" 
            style={{
              position: 'absolute',
              left: '58px',
              top: '260px',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              minWidth: '170px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 99999,
              pointerEvents: 'auto',
            }}
          >
            {moreTools.map(({ type, icon, label, shortcut }) => {
              const isActive = tool === type;
              return (
                <button
                  key={type}
                  onClick={() => {
                    setTool(type);
                    setShowMoreMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: isActive ? '#818cf8' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textAlign: 'left',
                    transition: 'var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {icon}
                    <span>{label}</span>
                  </div>
                  {shortcut && (
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', opacity: 0.7 }}>
                      {shortcut}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div style={styles.divider} />

        {/* Action Buttons */}
        <button onClick={onImageUpload} style={styles.toolBtn} title="Upload Image">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        </button>
        <button onClick={onUndo} style={styles.toolBtn} title="Undo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>
        </button>
        <button onClick={onRedo} style={styles.toolBtn} title="Redo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path></svg>
        </button>
        <button onClick={onClear} style={{ ...styles.toolBtn, color: 'var(--color-danger)' }} title="Clear Board">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </aside>

      <ToolbarContextPanels
        tool={tool}
        selectedSubShape={selectedSubShape}
        setSelectedSubShape={setSelectedSubShape}
        setTool={setTool}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        sharpness={sharpness}
        setSharpness={setSharpness}
        penStyle={penStyle}
        setPenStyle={setPenStyle}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontWeight={fontWeight}
        setFontWeight={setFontWeight}
        eraserWidth={eraserWidth}
        setEraserWidth={setEraserWidth}
        arrowDirection={arrowDirection}
        setArrowDirection={setArrowDirection}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'absolute',
    left: '20px',
    top: '100px',
    zIndex: 10,
    display: 'flex',
    gap: '12px',
    pointerEvents: 'none',
  },
  toolbar: { 
    width: '46px',
    padding: '10px 0', 
    borderRadius: 'var(--radius-md)', 
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: '10px', 
    pointerEvents: 'auto',
    boxShadow: 'var(--shadow-md)',
  },
  toolBtn: { 
    width: '32px', 
    height: '32px', 
    borderRadius: 'var(--radius-sm)', 
    display: 'flex',
    alignItems: 'center', 
    justifyContent: 'center', 
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    transition: 'var(--transition-fast)'
  },
  divider: { 
    width: '60%', 
    height: '1px', 
    backgroundColor: 'var(--color-border)', 
    margin: '4px 0' 
  },
};
