'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit3, Github, Twitter, Globe } from 'lucide-react';

interface FooterProps {
  user?: { name?: string | null; email?: string | null; image?: string | null } | null;
}

export default function Footer({ user }: FooterProps) {
  const [clientIsLoggedIn, setClientIsLoggedIn] = useState(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientIsLoggedIn(localStorage.getItem('cocanvas_logged_in') === 'true');
    }
  }, []);

  const isAuthed = !!user || clientIsLoggedIn;

  return (
    <footer style={styles.footer}>
      <div style={styles.footerInner} className="footer-inner">
        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>
              <Edit3 size={16} color="#fff" />
            </div>
            <span style={styles.logoText}>CoCanvas</span>
          </div>
          <p style={styles.tagline}>
            Real-time collaborative infinite canvas. 
            Built with Yjs CRDTs, WebSockets &amp; Redis.
          </p>
          <div style={styles.socialRow}>
            <a href="https://github.com/ankitvars/cocanvas" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
              <Github size={17} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
              <Twitter size={17} />
            </a>
            <a href="/" style={styles.socialLink}>
              <Globe size={17} />
            </a>
          </div>
        </div>

        {/* Links */}
        <div style={styles.linkGroups} className="footer-link-groups">
          <div style={styles.linkGroup}>
            <span style={styles.linkGroupTitle}>Product</span>
            <Link href="/dashboard" style={styles.footerLink}>Dashboard</Link>
            {!isAuthed && <Link href="/login" style={styles.footerLink}>Sign In</Link>}
          </div>

          <div style={styles.linkGroup}>
            <span style={styles.linkGroupTitle}>Deploy</span>
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>Vercel (Web)</a>
            <a href="https://railway.app" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>Railway (Server)</a>
            <a href="https://pulumi.com" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>Pulumi IaC</a>
          </div>
        </div>
      </div>

      <div style={styles.footerBottom} className="footer-bottom">
        <span>© {year} CoCanvas. Open source. MIT License.</span>
        <div style={styles.bottomLinks} className="footer-bottom-links">
          <span style={styles.techBadge}>React 19</span>
          <span style={styles.techBadge}>TypeScript</span>
          <span style={styles.techBadge}>Turborepo</span>
          <span style={styles.techBadge}>Drizzle ORM</span>
        </div>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    width: '100%',
    borderTop: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-primary)',
    marginTop: 'auto',
    position: 'relative',
    zIndex: 1,
  },
  footerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 24px 48px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '48px',
    flexWrap: 'wrap',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '280px',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    background: 'var(--color-accent-gradient)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: 700,
    letterSpacing: '-0.5px',
  },
  tagline: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    lineHeight: 1.7,
  },
  socialRow: {
    display: 'flex',
    gap: '12px',
  },
  socialLink: {
    width: '34px',
    height: '34px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text-muted)',
    transition: 'var(--transition-fast)',
  },
  linkGroups: {
    display: 'flex',
    gap: '48px',
    flexWrap: 'wrap',
  },
  linkGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  linkGroupTitle: {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--color-text-primary)',
    marginBottom: '4px',
  },
  footerLink: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    transition: 'var(--transition-fast)',
    textDecoration: 'none',
  },
  footerBottom: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px 24px',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  },
  bottomLinks: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  techBadge: {
    padding: '3px 10px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--color-border)',
    fontSize: '11px',
    color: 'var(--color-text-muted)',
  },
};
