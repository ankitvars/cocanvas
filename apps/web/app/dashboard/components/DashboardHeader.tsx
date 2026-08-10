import { Edit3, LogOut } from 'lucide-react';
import { getOptimizedAvatarUrl } from '../../../lib/utils';

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  signOutAction: () => Promise<void>;
}

export default function DashboardHeader({ user, signOutAction }: DashboardHeaderProps) {
  return (
    <header className="glass" style={styles.header}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <Edit3 size={18} color="#fff" />
        </div>
        <span style={styles.logoText}>CoCanvas Dashboard</span>
      </div>

      <div style={styles.userProfile}>
        <div style={styles.userInfo}>
          <span style={styles.userName}>{user.name || 'User'}</span>
          <span style={styles.userEmail}>{user.email}</span>
        </div>
        {user.image ? (
          <img src={getOptimizedAvatarUrl(user.image, 64)} alt="User Avatar" style={styles.avatar} />
        ) : (
          <div style={styles.avatarPlaceholder}>{user.name?.[0] || 'U'}</div>
        )}
        
        <button 
          onClick={() => signOutAction()}
          style={styles.btnLogout} 
          title="Log Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    height: '70px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 32px',
    borderBottom: '1px solid var(--color-border)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    width: '28px',
    height: '28px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--color-accent-gradient)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: 700,
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    lineHeight: '1.2',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 600,
  },
  userEmail: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1px solid var(--color-border)',
  },
  avatarPlaceholder: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-accent-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
    color: '#fff',
  },
  btnLogout: {
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '6px',
    borderRadius: 'var(--radius-sm)',
    transition: 'var(--transition-fast)',
  },
};
