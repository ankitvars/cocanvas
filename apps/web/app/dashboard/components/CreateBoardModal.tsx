import { useState } from 'react';

interface CreateBoardModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  handleCreate: (name: string, isPublic: boolean) => Promise<void>;
  submitting: boolean;
  error: string;
}

export default function CreateBoardModal({
  showModal,
  setShowModal,
  handleCreate,
  submitting,
  error,
}: CreateBoardModalProps) {
  const [newBoardName, setNewBoardName] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  if (!showModal) return null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    handleCreate(newBoardName, isPublic);
  };

  return (
    <div style={styles.modalOverlay}>
      <div className="glass modal-card" style={styles.modal}>
        <h2 style={styles.modalTitle}>Create New Whiteboard</h2>
        <form onSubmit={onSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Board Name</label>
            <input 
              type="text" 
              placeholder="e.g. Brainstorming Session" 
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              required
              autoFocus
              style={styles.input}
            />
          </div>

          <div style={styles.formGroupRow}>
            <input 
              type="checkbox" 
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              style={styles.checkbox}
            />
            <label htmlFor="isPublic" style={styles.checkboxLabel}>
              Make this board public (anyone with the link can view)
            </label>
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <div style={styles.modalActions}>
            <button 
              type="button" 
              onClick={() => setShowModal(false)}
              style={styles.btnCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              style={styles.btnSubmit}
            >
              {submitting ? 'Creating...' : 'Create Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '20px',
  },
  modal: {
    width: 'min(460px, 90vw)',
    padding: '32px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: 700,
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
  },
  input: {
    width: '100%',
    height: '42px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '0 16px',
    fontSize: '14px',
    outline: 'none',
    transition: 'var(--transition-fast)',
  },
  formGroupRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: 'var(--color-accent-primary)',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
  },
  errorText: {
    fontSize: '13px',
    color: 'var(--color-error)',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px',
    flexWrap: 'wrap',
  },
  btnCancel: {
    padding: '10px 18px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
  },
  btnSubmit: {
    backgroundColor: 'var(--color-accent-primary)',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
