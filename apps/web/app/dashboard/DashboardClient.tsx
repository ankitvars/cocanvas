'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBoard, deleteBoard } from '../actions/board';

import DashboardHeader from './components/DashboardHeader';
import DashboardControls from './components/DashboardControls';
import BoardList from './components/BoardList';
import CreateBoardModal from './components/CreateBoardModal';

interface Board {
  id: string;
  name: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DashboardClientProps {
  initialBoards: Board[];
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  signOutAction: () => Promise<void>;
}

export default function DashboardClient({ initialBoards, user, signOutAction }: DashboardClientProps) {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle Board Creation
  const handleCreate = async (name: string, isPublic: boolean) => {
    setSubmitting(true);
    setError('');

    const res = await createBoard(name, isPublic);
    setSubmitting(false);

    if (res.success && res.board) {
      setBoards([res.board as unknown as Board, ...boards]);
      setShowModal(false);
      
      // Redirect to the new board
      router.push(`/board/${res.board.id}`);
    } else {
      setError(res.error || 'Failed to create board');
    }
  };

  // Handle Board Deletion
  const handleDelete = async (boardId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this board? This action is permanent.')) {
      return;
    }

    const res = await deleteBoard(boardId);
    if (res.success) {
      setBoards(boards.filter(b => b.id !== boardId));
    } else {
      alert(res.error || 'Failed to delete board');
    }
  };

  // Filtered boards list
  const filteredBoards = boards.filter(board => 
    board.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.dashboardContainer}>
      <DashboardHeader user={user} signOutAction={signOutAction} />

      <main className="dashboard-wrapper" style={styles.main}>
        <DashboardControls 
          search={search}
          setSearch={setSearch}
          view={view}
          setView={setView}
          setShowModal={setShowModal}
        />

        <BoardList 
          filteredBoards={filteredBoards}
          view={view}
          handleDelete={handleDelete}
          setShowModal={setShowModal}
        />
      </main>

      <CreateBoardModal 
        showModal={showModal}
        setShowModal={setShowModal}
        handleCreate={handleCreate}
        submitting={submitting}
        error={error}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  dashboardContainer: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--color-bg-primary)',
  },
  main: {
    flex: 1,
    padding: '32px 20px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
  },
};
