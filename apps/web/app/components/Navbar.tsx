'use client';

import Link from 'next/link';
import { Edit3, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { getOptimizedAvatarUrl } from '../../lib/utils';

interface NavbarProps {
  user?: { name?: string | null; email?: string | null; image?: string | null } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [clientIsLoggedIn, setClientIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientIsLoggedIn(localStorage.getItem('cocanvas_logged_in') === 'true');
    }
  }, []);

  const isAuthed = !!user || clientIsLoggedIn;

  return (
    <header className="glass navbar-container" style={styles.header}>
      <Link href="/" style={styles.logoContainer}>
        <div style={styles.logoIcon}>
          <Edit3 size={20} color="#fff" />
        </div>
        <span style={styles.logoText} className="navbar-logo-text">CoCanvas</span>
      </Link>

      <nav style={styles.navLinks}>
        {isAuthed ? (
          // ── Logged-in state ────────────────────────────────────────────────
          <div style={styles.userMenu}>
            <Link href="/dashboard" style={styles.btnPrimary}>
              <LayoutDashboard size={15} />
              <span className="navbar-btn-text">Dashboard</span>
            </Link>

            {user && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  style={styles.avatarBtn}
                  className="navbar-avatar-btn"
                >
                  {user.image ? (
                    <img src={getOptimizedAvatarUrl(user.image, 64)} alt="" style={styles.avatarImg} />
                  ) : (
                    <div style={styles.avatarFallback}>
                      {user.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <ChevronDown size={13} className="navbar-avatar-chevron" style={{ color: 'var(--color-text-muted)' }} />
                </button>

                {dropdownOpen && (
                  <div className="glass" style={styles.dropdown}>
                    <div style={styles.dropdownUser}>
                      <span style={styles.dropdownName}>{user.name}</span>
                      <span style={styles.dropdownEmail}>{user.email}</span>
                    </div>
                    <div style={styles.dropdownDivider} />
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      style={styles.dropdownItem}
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // ── Logged-out state ───────────────────────────────────────────────
          <>
            <Link href="/login" style={styles.btnSecondary} className="navbar-btn-text">Sign In</Link>
            <Link href="/login" style={styles.btnPrimary}>
              Get Started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: '1200px',
    minHeight: '64px',
    height: 'auto',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    zIndex: 100,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--color-accent-gradient)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
    letterSpacing: '-0.5px',
    color: 'var(--color-text-primary)',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  btnPrimary: {
    backgroundColor: 'var(--color-accent-primary)',
    padding: '8px 16px',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 600,
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#fff',
    transition: 'var(--transition-fast)',
  },
  btnSecondary: {
    color: 'var(--color-text-secondary)',
    fontWeight: 500,
    fontSize: '14px',
    transition: 'var(--transition-fast)',
  },
  avatarBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'transparent',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    padding: '4px 10px 4px 4px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  avatarImg: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarFallback: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'var(--color-accent-gradient)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
    color: '#fff',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    minWidth: '200px',
    maxWidth: 'calc(100vw - 32px)',
    borderRadius: 'var(--radius-md)',
    padding: '8px',
    zIndex: 200,
  },
  dropdownUser: {
    padding: '8px 10px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  dropdownName: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  dropdownEmail: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '4px 0',
  },
  dropdownItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 10px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
};
