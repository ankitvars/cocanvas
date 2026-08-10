import Link from 'next/link';
import { Edit3, Trash2, Globe, Lock, ExternalLink } from 'lucide-react';

interface Board {
  id: string;
  name: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface BoardListProps {
  filteredBoards: Board[];
  view: 'grid' | 'list';
  handleDelete: (boardId: string, e: React.MouseEvent) => Promise<void>;
  setShowModal: (show: boolean) => void;
}

// Explicit locale + options to get identical output on server and client
function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function BoardList({
  filteredBoards,
  view,
  handleDelete,
  setShowModal,
}: BoardListProps) {
  if (filteredBoards.length === 0) {
    return (
      <div className="glass" style={styles.emptyState}>
        <p style={styles.emptyText}>No boards found. Create a new one to get started!</p>
        <button onClick={() => setShowModal(true)} style={styles.btnNewEmpty}>
          Create First Board
        </button>
      </div>
    );
  }

  if (view === 'grid') {
    return (
      <div style={styles.grid}>
        {filteredBoards.map(board => (
          <Link href={`/board/${board.id}`} key={board.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass" style={styles.boardCard}>
              <div style={styles.cardHeader}>
                <div style={styles.boardIcon}>
                  <Edit3 size={18} color="var(--color-accent-secondary)" />
                </div>
                <button 
                  onClick={(e) => handleDelete(board.id, e)}
                  style={styles.btnDelete}
                  title="Delete Board"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 style={styles.boardTitle}>{board.name}</h3>
              <div style={styles.cardFooter}>
                <span style={styles.boardMeta}>
                  {board.isPublic ? (
                    <span style={styles.statusSpan}>
                      <Globe size={12} style={{ marginRight: '4px' }} /> Public
                    </span>
                  ) : (
                    <span style={styles.statusSpan}>
                      <Lock size={12} style={{ marginRight: '4px' }} /> Private
                    </span>
                  )}
                </span>
                <span style={styles.dateMeta}>
                  {formatDate(board.updatedAt)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="glass" style={styles.listView}>
      {filteredBoards.map(board => (
        <div key={board.id} style={styles.listItem}>
          <div style={styles.listInfo}>
            <Edit3 size={16} color="var(--color-accent-secondary)" style={{ marginRight: '12px' }} />
            <Link href={`/board/${board.id}`} style={styles.listTitle}>
              {board.name}
            </Link>
            {board.isPublic ? (
              <span title="Public" style={{ display: 'inline-flex', marginLeft: '10px' }}>
                <Globe size={14} color="var(--color-text-muted)" />
              </span>
            ) : (
              <span title="Private" style={{ display: 'inline-flex', marginLeft: '10px' }}>
                <Lock size={14} color="var(--color-text-muted)" />
              </span>
            )}
          </div>
          <div style={styles.listMeta}>
            <span style={styles.listDate}>
              Edited: {formatDate(board.updatedAt)}
            </span>
            <Link href={`/board/${board.id}`} style={styles.btnOpenLink}>
              <ExternalLink size={16} />
            </Link>
            <button 
              onClick={(e) => handleDelete(board.id, e)}
              style={styles.btnDeleteList}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  emptyState: {
    padding: '80px 40px',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  emptyText: {
    color: 'var(--color-text-secondary)',
    marginBottom: '20px',
    fontSize: '15px',
  },
  btnNewEmpty: {
    backgroundColor: 'var(--color-accent-primary)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  boardCard: {
    padding: '24px',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '160px',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  boardIcon: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDelete: {
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: 'var(--radius-sm)',
    transition: 'var(--transition-fast)',
  },
  boardTitle: {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: 'auto',
    color: 'var(--color-text-primary)',
    lineHeight: '1.3',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '12px',
  },
  boardMeta: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  statusSpan: {
    display: 'flex',
    alignItems: 'center',
  },
  dateMeta: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  },
  listView: {
    borderRadius: 'var(--radius-lg)',
    padding: '8px 0',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid var(--color-border)',
  },
  listInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    textDecoration: 'none',
  },
  listMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  listDate: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
  },
  btnOpenLink: {
    color: 'var(--color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    padding: '6px',
    borderRadius: 'var(--radius-sm)',
  },
  btnDeleteList: {
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: 'var(--radius-sm)',
  },
};
