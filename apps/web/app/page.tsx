import { Edit3, Users, Zap, Shield, GitBranch } from 'lucide-react';
import Link from 'next/link';
import { auth } from '../auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default async function Home() {
  // Read session on the server — no client JS needed
  const session = await auth();
  const user = session?.user ?? null;

  return (
    <main style={styles.main}>
      <div style={styles.bgGlow1}></div>
      <div style={styles.bgGlow2}></div>

      {/* Dynamic Navbar — shows avatar + dashboard if logged in */}
      <Navbar user={user} />

      {/* Hero */}
      <section style={styles.heroSection}>
        <div style={styles.badge}>
          <span style={styles.badgeDot}></span>
          Now in Beta · 100% Free Stack
        </div>
        <h1 style={styles.heroTitle}>
          Real-Time Collaborative <br />
          <span className="gradient-text">Infinite Whiteboard</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Draw, plan, and collaborate with your team instantly. Built with
          conflict-free Yjs CRDTs, live cursor tracking, and a gorgeous,
          fast canvas.
        </p>

        <div style={styles.ctaGroup}>
          <Link href={user ? '/dashboard' : '/login'} style={styles.btnHeroPrimary}>
            {user ? 'Open Dashboard →' : 'Start Drawing — Free'}
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.btnHeroSecondary}
          >
            View on GitHub
          </a>
        </div>

        {/* Mini tech stack pill strip */}
        <div style={styles.pillRow}>
          {['Yjs CRDTs', 'WebSockets', 'Redis Pub/Sub', 'Neon Postgres', 'Auth.js', 'Turborepo'].map(t => (
            <span key={t} style={styles.pill}>{t}</span>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section style={styles.featuresSection}>
        <div style={styles.featuresGrid}>
          <div className="glass" style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <Zap size={24} color="var(--color-accent-secondary)" />
            </div>
            <h3 style={styles.featureTitle}>Real-time Sync</h3>
            <p style={styles.featureDesc}>
              Sub-millisecond updates powered by WebSockets and Redis pub/sub. Smooth cursor mapping for all collaborators.
            </p>
          </div>

          <div className="glass" style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <GitBranch size={24} color="var(--color-accent-primary)" />
            </div>
            <h3 style={styles.featureTitle}>CRDT Resolution</h3>
            <p style={styles.featureDesc}>
              Conflict-free updates via Yjs. Draw simultaneously without overwriting teammate work — even offline.
            </p>
          </div>

          <div className="glass" style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <Users size={24} color="var(--color-accent-secondary)" />
            </div>
            <h3 style={styles.featureTitle}>Presence Tracking</h3>
            <p style={styles.featureDesc}>
              See active cursors, colour-coded selections, and live avatars of everyone on the board at the same time.
            </p>
          </div>

          <div className="glass" style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <Shield size={24} color="var(--color-accent-primary)" />
            </div>
            <h3 style={styles.featureTitle}>Production Hardened</h3>
            <p style={styles.featureDesc}>
              JWT auth, strict CORS, Helmet security headers, rate-limiting, and Postgres-backed incremental Yjs snapshots.
            </p>
          </div>

          <div className="glass" style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <Edit3 size={24} color="var(--color-accent-secondary)" />
            </div>
            <h3 style={styles.featureTitle}>Rich Drawing Tools</h3>
            <p style={styles.featureDesc}>
              Freehand, rectangles, ellipses, arrows, text blocks, sticky notes — with per-user undo/redo via UndoManager.
            </p>
          </div>

          <div className="glass" style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <Zap size={24} color="var(--color-accent-primary)" />
            </div>
            <h3 style={styles.featureTitle}>Zero-latency Canvas</h3>
            <p style={styles.featureDesc}>
              Drawing is rendered locally first via React-Konva refs. Yjs syncs only on stroke commit — no lag while drawing.
            </p>
          </div>
        </div>
      </section>

      <Footer user={user} />
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'var(--color-bg-primary)',
    paddingTop: '80px',
  },
  bgGlow1: {
    position: 'fixed',
    top: '-10%',
    left: '10%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, hsla(250, 90%, 65%, 0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  bgGlow2: {
    position: 'fixed',
    bottom: '10%',
    right: '5%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, hsla(180, 70%, 50%, 0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  heroSection: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '800px',
    margin: '60px auto 40px',
    padding: '0 20px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    padding: '6px 14px',
    borderRadius: 'var(--radius-full)',
    fontSize: '13px',
    color: 'var(--color-accent-secondary)',
    fontWeight: 500,
    marginBottom: '24px',
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-accent-secondary)',
    boxShadow: '0 0 8px var(--color-accent-secondary)',
    display: 'inline-block',
  },
  heroTitle: {
    fontSize: 'clamp(32px, 7vw, 58px)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-1.5px',
    marginBottom: '20px',
  },
  heroSubtitle: {
    fontSize: 'clamp(15px, 2vw, 18px)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
    marginBottom: '32px',
    maxWidth: '640px',
  },
  ctaGroup: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btnHeroPrimary: {
    background: 'var(--color-accent-gradient)',
    padding: '14px 28px',
    borderRadius: 'var(--radius-md)',
    fontWeight: 700,
    fontSize: '15px',
    boxShadow: '0 4px 24px rgba(100, 50, 255, 0.3)',
    transition: 'var(--transition-smooth)',
    color: '#fff',
  },
  btnHeroSecondary: {
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-secondary)',
    padding: '14px 28px',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    fontSize: '15px',
    transition: 'var(--transition-smooth)',
    color: 'var(--color-text-secondary)',
  },
  pillRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    marginTop: '8px',
  },
  pill: {
    padding: '4px 12px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--color-border)',
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-bg-secondary)',
  },
  featuresSection: {
    position: 'relative',
    zIndex: 1,
    width: '90%',
    maxWidth: '1200px',
    margin: '60px auto 80px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  featureCard: {
    padding: '32px 24px',
    borderRadius: 'var(--radius-lg)',
    transition: 'var(--transition-smooth)',
  },
  featureIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '10px',
  },
  featureDesc: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
  },
};
