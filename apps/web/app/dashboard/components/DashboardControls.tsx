import { Search, Grid, List, Plus } from 'lucide-react';

interface DashboardControlsProps {
  search: string;
  setSearch: (s: string) => void;
  view: 'grid' | 'list';
  setView: (v: 'grid' | 'list') => void;
  setShowModal: (show: boolean) => void;
}

export default function DashboardControls({
  search,
  setSearch,
  view,
  setView,
  setShowModal,
}: DashboardControlsProps) {
  return (
    <div className="dashboard-controls" style={styles.controls}>
      <div className="dashboard-search" style={styles.searchWrapper}>
        <Search size={18} color="var(--color-text-muted)" style={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Search boards..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.actions}>
        <div className="glass" style={styles.viewToggle}>
          <button 
            onClick={() => setView('grid')}
            style={{
              ...styles.toggleBtn, 
              backgroundColor: view === 'grid' ? 'var(--color-bg-elevated)' : 'transparent',
              color: view === 'grid' ? '#fff' : 'var(--color-text-secondary)'
            }}
            title="Grid View"
          >
            <Grid size={16} />
          </button>
          <button 
            onClick={() => setView('list')}
            style={{
              ...styles.toggleBtn, 
              backgroundColor: view === 'list' ? 'var(--color-bg-elevated)' : 'transparent',
              color: view === 'list' ? '#fff' : 'var(--color-text-secondary)'
            }}
            title="List View"
          >
            <List size={16} />
          </button>
        </div>

        <button onClick={() => setShowModal(true)} style={styles.btnNew}>
          <Plus size={16} />
          New Board
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  searchWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '360px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  searchInput: {
    width: '100%',
    height: '42px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    paddingLeft: '40px',
    paddingRight: '16px',
    fontSize: '14px',
    outline: 'none',
    transition: 'var(--transition-fast)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  viewToggle: {
    display: 'flex',
    borderRadius: 'var(--radius-sm)',
    padding: '2px',
  },
  toggleBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  btnNew: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'var(--color-accent-primary)',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(100, 50, 255, 0.2)',
    transition: 'var(--transition-fast)',
  },
};
