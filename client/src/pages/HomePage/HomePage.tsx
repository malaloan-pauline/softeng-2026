import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import './HomePage.css';
import logo from '../../assets/name_logo.png';
import icon from '../../assets/icon.png';
import iconDark from '../../assets/icon_light.png';
import logoDark from '../../assets/name_logo_light.png';

export default function HomePage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Applique le thème sur <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Ferme la sidebar avec Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // IntersectionObserver pour les animations au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.12 }
    );
    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const addRef = (el: HTMLElement | null, index: number) => {
    sectionRefs.current[index] = el;
  };

  return (
      <div className="home-page">
        {/* Halos de fond */}
        <div className="bg-halos" aria-hidden="true">
          <div className="halo halo-green" />
          <div className="halo halo-pink" />
          <div className="halo halo-green-bottom" />
        </div>

        {/* SIDEBAR OVERLAY */}
        <div
            className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
        />

        {/* SIDEBAR */}
        <aside
            className={`sidebar${sidebarOpen ? ' open' : ''}`}
            aria-label="Quick access"
        >
          <button
              className="sidebar-close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fermer le menu"
          >
            ✕
          </button>
          <p className="sidebar-label">Quick access</p>

          <div className="sidebar-item sidebar-item--primary" onClick={() => { navigate('/leaderboard'); setSidebarOpen(false); }}>
            <span className="sidebar-item-icon">🏆</span>
            <span className="sidebar-item-title">Leaderboard</span>
            <span className="sidebar-item-sub">Top players</span>
          </div>

          <div className="sidebar-item" onClick={() => setSidebarOpen(false)}>
            <span className="sidebar-item-icon">⬛</span>
            <span className="sidebar-item-title">QR Code</span>
            <span className="sidebar-item-sub">Scan to play</span>
            <div className="qr-placeholder" aria-label="QR Code">
              {/* Remplace par <QRCodeCanvas value={window.location.href} size={64} /> avec la lib qrcode.react */}
              <div className="qr-mock" />
            </div>
          </div>
        </aside>

        {/* NAVBAR */}
        <nav className="topbar">
          <button
              className="topbar-logo"
              onClick={() => setSidebarOpen(true)}
              aria-label="Ouvrir le menu Quick Access"
              aria-expanded={sidebarOpen}
          >
            <img src={theme === 'dark' ? iconDark : icon} alt="" className="topbar-computer-img" aria-hidden="true"/>
            <img src={theme === 'dark' ? logoDark : logo} alt="match IT" className="topbar-logo-img" />
            <span className="topbar-logo-hint" aria-hidden="true">☰</span>
          </button>

          <div className="topbar-center">
            <button className="topbar-link" onClick={() => navigate('/games')}>Games</button>
            <button className="topbar-link" onClick={() => navigate('/quiz')}>Quiz</button>
            <button className="topbar-link" onClick={() => navigate('/feedback')}>Feedbacks</button>
          </div>

          <div className="topbar-right">
            <button className="topbar-btn" onClick={() => navigate('/leaderboard')}>Leaderboard</button>
            <button
                className="theme-toggle"
                onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>

        {/* MOBILE BOTTOM NAV */}
        <nav className="mobile-nav" aria-label="Navigation mobile">
          <button className="mobile-nav-item" onClick={() => navigate('/leaderboard')}>🏆<span>Board</span></button>
          <button className="mobile-nav-item mobile-nav-item--home" onClick={() => navigate('/')}>🏠<span>Home</span></button>
          <button className="mobile-nav-item" onClick={() => navigate('/feedback')}>🗣️<span>Feedbacks</span></button>
        </nav>

        {/* PAGE CONTENT */}
        <main className="page-content">

          {/* HERO */}
          <section className="hero-section">
          <span className="hero-eyebrow animate-in" style={{ '--delay': '0ms' } as React.CSSProperties}>
            Bachelor Computer Science
          </span>
            <img src={theme === 'dark' ? iconDark : icon} alt="" className="hero-icon" aria-hidden="true" />
            <h1 className="hero-title animate-in" style={{ '--delay': '80ms' } as React.CSSProperties}>
              <img src={theme === 'dark' ? logoDark : logo} alt="match IT" className="hero-logo" />
            </h1>
            <p className="hero-sub animate-in" style={{ '--delay': '160ms' } as React.CSSProperties}>
              Discover the Bachelor CS through games, quizzes and fun challenges.
            </p>
            <div className="hero-cta animate-in" style={{ '--delay': '240ms' } as React.CSSProperties}>
              <button className="cta-btn cta-btn--primary" onClick={() => navigate('/games')}>
                🎮 Play games
              </button>
              <button className="cta-btn cta-btn--accent" onClick={() => navigate('/quiz')}>
                ✨ Take the quiz
              </button>
              <button className="cta-btn" onClick={() => navigate('/feedback')}>
                💬 Feedbacks
              </button>
            </div>
          </section>

          <div className="divider" />

          {/* FEEDBACKS */}
          <section
              className="feedbacks-section scroll-reveal"
              ref={(el) => addRef(el, 0)}
          >
            <p className="section-label">— Student feedbacks —</p>
            <div className="feedback-grid">
              {[
                { author: 'Student 1', stars: 5, text: '"Great experience overall!"' },
                { author: 'Student 2', stars: 4, text: '"Amazing, loved the quiz."' },
                { author: 'Student 3', stars: 5, text: '"Super fun and informative!"' },
              ].map((fb) => (
                  <div className="feedback-card" key={fb.author}>
                    <div className="feedback-accent-bar" />
                    <div className="feedback-stars">{'★'.repeat(fb.stars)}{'☆'.repeat(5 - fb.stars)}</div>
                    <p className="feedback-text">{fb.text}</p>
                    <span className="feedback-author">{fb.author}</span>
                  </div>
              ))}
            </div>
          </section>

          <div className="divider" />

          <footer className="page-footer">
            Copyright © 2026 match IT — Group C
          </footer>
        </main>
      </div>
  );
}