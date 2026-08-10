'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <main style={styles.container}>
      {/* Background glow effects */}
      <div style={styles.bgGlow1}></div>
      <div style={styles.bgGlow2}></div>

      <div className="glass" style={styles.card}>
        <div style={styles.iconWrapper}>
          <AlertTriangle size={32} color="var(--color-error)" />
        </div>

        <h1 style={styles.title}>Something went wrong</h1>
        <p style={styles.subtitle}>
          CoCanvas encountered an unexpected error. Don't worry, your work is synced via Yjs and safe.
        </p>

        <div style={styles.btnGroup}>
          <button onClick={() => reset()} style={styles.btnPrimary}>
            <RefreshCw size={16} />
            Try Again
          </button>
          <Link href="/dashboard" style={styles.btnSecondary}>
            <Home size={16} />
            Back to Dashboard
          </Link>
        </div>

        {/* Expandable details block */}
        <div style={styles.detailsContainer}>
          <button 
            onClick={() => setShowDetails(!showDetails)} 
            style={styles.detailsToggle}
          >
            <span>Technical Details</span>
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showDetails && (
            <div style={styles.detailsContent}>
              <p style={styles.errorMsg}>
                <strong>Error:</strong> {error.message || 'No message provided'}
              </p>
              {error.digest && (
                <p style={styles.errorDigest}>
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
              {error.stack && (
                <pre style={styles.stackTrace}>
                  {error.stack.split('\n').slice(0, 5).join('\n')}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg-primary)',
    position: 'relative',
    overflow: 'hidden',
    padding: '24px',
  },
  bgGlow1: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, hsla(0, 90%, 65%, 0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  bgGlow2: {
    position: 'absolute',
    bottom: '20%',
    right: '20%',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, hsla(250, 90%, 65%, 0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    padding: '40px 32px',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: 'var(--shadow-lg)',
    position: 'relative',
    zIndex: 1,
  },
  iconWrapper: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 800,
    marginBottom: '12px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
    marginBottom: '32px',
  },
  btnGroup: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    justifyContent: 'center',
    marginBottom: '28px',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    backgroundColor: 'var(--color-accent-primary)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'var(--transition-fast)',
  },
  btnSecondary: {
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-secondary)',
    color: 'var(--color-text-secondary)',
    padding: '12px 24px',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'var(--transition-fast)',
  },
  detailsContainer: {
    width: '100%',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '20px',
  },
  detailsToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    background: 'none',
    border: 'none',
  },
  detailsContent: {
    marginTop: '16px',
    textAlign: 'left',
    width: '100%',
    backgroundColor: 'var(--color-bg-secondary)',
    padding: '16px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    fontSize: '12px',
  },
  errorMsg: {
    color: 'var(--color-error)',
    marginBottom: '8px',
  },
  errorDigest: {
    color: 'var(--color-text-secondary)',
    marginBottom: '8px',
  },
  stackTrace: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-muted)',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.5',
  },
};
