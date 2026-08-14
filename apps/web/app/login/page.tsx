import { Edit3, Github, Chrome } from 'lucide-react';
import { signIn } from '../../auth';
import Link from 'next/link';

interface LoginPageProps {
  searchParams: Promise<{ redirectTo?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirectTo } = await searchParams;
  const targetRedirect = redirectTo || '/dashboard';

  return (
    <main style={styles.main}>
      <div style={styles.bgGlow}></div>

      <div className="glass" style={styles.card}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <Edit3 size={24} color="#fff" />
          </div>
          <span style={styles.logoText}>CoCanvas</span>
        </div>

        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to access your infinite whiteboards</p>
        </div>

        <div style={styles.btnGroup}>
          <form
            action={async () => {
              'use server';
              await signIn('github', { redirectTo: targetRedirect });
            }}
          >
            <button type="submit" style={styles.btnSocial}>
              <Github size={20} style={styles.socialIcon} />
              Continue with GitHub
            </button>
          </form>

          <form
            action={async () => {
              'use server';
              await signIn('google', { redirectTo: targetRedirect });
            }}
          >
            <button type="submit" style={styles.btnSocial}>
              <Chrome size={20} style={styles.socialIcon} />
              Continue with Google
            </button>
          </form>
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>or</span>
          <span style={styles.dividerLine}></span>
        </div>

        <Link href="/" style={styles.btnBack}>
          Back to landing page
        </Link>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg-primary)',
    overflow: 'auto',
  },
  bgGlow: {
    position: 'absolute',
    width: 'min(600px, 80vw)',
    height: 'min(600px, 80vw)',
    borderRadius: '50%',
    background: 'radial-gradient(circle, hsla(250, 90%, 65%, 0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '420px',
    padding: 'clamp(24px, 4vw, 40px) clamp(20px, 4vw, 32px)',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: 'var(--shadow-lg)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '32px',
  },
  logoIcon: {
    width: '38px',
    height: '38px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--color-accent-gradient)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: 800,
    letterSpacing: '-0.5px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
  },
  btnGroup: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  btnSocial: {
    width: '100%',
    height: '48px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    outline: 'none',
  },
  socialIcon: {
    marginRight: '12px',
  },
  divider: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'var(--color-border)',
  },
  dividerText: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    padding: '0 12px',
    textTransform: 'uppercase',
  },
  btnBack: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    transition: 'var(--transition-fast)',
  },
};
