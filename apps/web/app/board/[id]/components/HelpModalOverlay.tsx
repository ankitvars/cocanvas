import React from 'react';
import { X } from 'lucide-react';

interface HelpModalOverlayProps {
  showHelpModal: boolean;
  setShowHelpModal: (show: boolean) => void;
}

export default function HelpModalOverlay({
  showHelpModal,
  setShowHelpModal,
}: HelpModalOverlayProps) {
  if (!showHelpModal) return null;

  return (
    <div
      onClick={() => setShowHelpModal(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '640px',
          maxWidth: '90vw',
          maxHeight: '85vh',
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Help & Shortcuts</h2>
          <button
            onClick={() => setShowHelpModal(false)}
            style={{
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              padding: '4px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Columns */}
        <div style={{ display: 'flex', gap: '24px', flexDirection: 'row', flexWrap: 'wrap' }}>
          
          {/* Left Column: Tools */}
          <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Tools</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Selection tool', key: 'Shift + 1 (or V)' },
                { label: 'Draw (Pen)', key: 'Shift + 2 (or P)' },
                { label: 'Line tool', key: 'Shift + 3 (or L)' },
                { label: 'Shape tool', key: 'Shift + 4 (or R/D/O)' },
                { label: 'Arrow tool', key: 'Shift + 5 (or A)' },
                { label: 'Text tool', key: 'Shift + 6 (or T)' },
                { label: 'Eraser tool', key: 'Shift + 7 (or E)' },
                { label: 'Comment tool', key: 'Shift + 8 (or C)' },
                { label: 'Insert Image', key: 'Shift + 9 (or I)' },
                { label: 'Frame container', key: 'Shift + F' },
                { label: 'Laser pointer', key: 'Shift + K' },
                { label: 'Bucket fill', key: 'Shift + B' },
                { label: 'Lasso selection', key: 'Shift + S' },
                { label: 'Draw Snapping', key: 'Shift + X' },
                { label: 'Reaction emoji picker', key: 'Shift + Q' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{item.label}</span>
                  <kbd style={{
                    padding: '2px 6px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#fff',
                    fontWeight: 600,
                  }}>{item.key}</kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Controls */}
          <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Controls</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Pan Canvas', key: 'Space + Drag' },
                  { label: 'Zoom In / Out', key: 'Scroll Wheel' },
                  { label: 'Cycle Background Grid', key: 'Shift + G' },
                  { label: 'Toggle Help Modal', key: '?' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{item.label}</span>
                    <kbd style={{
                      padding: '2px 6px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      color: '#fff',
                      fontWeight: 600,
                    }}>{item.key}</kbd>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Keyboard Navigation</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: 0 }}>
                Press Shift combined with any shortcut key to instantly activate its corresponding tool (e.g. Shift + V, Shift + R). Shortcuts will not trigger while typing in text shapes or comment inputs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
