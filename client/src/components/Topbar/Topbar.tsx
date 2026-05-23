import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Topbar.css';
import logo from '../../assets/name_logo.png';
import icon from '../../assets/icon.png';
import iconDark from '../../assets/icon_light.png';
import logoDark from '../../assets/name_logo_light.png';
import sideIconDark from '../../assets/sidebar_dark.png';
import sideIconLight from '../../assets/sidebar_light.png';
import ProfileModal from '../../user-system/ProfileModal';

function readPseudo(): string | null {
  const stored = localStorage.getItem('matchit_player');
  return stored ? (JSON.parse(stored) as { pseudo: string }).pseudo : null;
}

function readAvatarUrl(): string {
  const stored = localStorage.getItem('matchit_player');
  return stored
    ? ((JSON.parse(stored) as { avatarUrl?: string }).avatarUrl ?? '/images/users/default.png')
    : '/images/users/default.png';
}

export default function Topbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);


  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setNavVisible(current < lastScrollY.current || current < 50);
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const [pseudo, setPseudo] = useState<string | null>(readPseudo);
  const [avatarUrl, setAvatarUrl] = useState<string>(readAvatarUrl);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const pillRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const refresh = () => { setPseudo(readPseudo()); setAvatarUrl(readAvatarUrl()); };
    window.addEventListener('matchit:player-updated', refresh);
    return () => window.removeEventListener('matchit:player-updated', refresh);
  }, []);

  function closeProfile() {
    setShowProfileModal(false);
    pillRef.current?.focus();
  }

  return (
    <>
      {showProfileModal && (
        <ProfileModal onClose={closeProfile} />
      )}

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
          aria-label="Close menu"
        >
          ✕
        </button>
        <p className="sidebar-label">Quick access</p>

        <div
          className="sidebar-item sidebar-item--primary"
          onClick={() => { navigate('/'); setSidebarOpen(false); }}
        >
          <span className="sidebar-item-icon">🏠</span>
          <span className="sidebar-item-title">Match IT</span>
          <span className="sidebar-item-sub">Home Page</span>
        </div>

        <div className="sidebar-item" onClick={() => setSidebarOpen(false)}>
          <span className="sidebar-item-icon">⬛</span>
          <span className="sidebar-item-title">QR Code</span>
          <span className="sidebar-item-sub">Scan to play</span>
          <div className="qr-placeholder" aria-label="QR Code">
            {/* Replace with <QRCodeCanvas value={window.location.href} size={64} /> from qrcode.react */}
            <div className="qr-mock" />
          </div>
        </div>

        <div className="sidebar-footer">
          <img
            src={theme === 'dark' ? sideIconDark : sideIconLight}
            alt=""
            className="sidebar-footer-logo"
            aria-hidden="true"
          />
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
          <img src={theme === 'dark' ? iconDark : icon} alt="" className="topbar-computer-img" aria-hidden="true" />
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
          {pseudo !== null && (
            <button
              ref={pillRef}
              className="topbar-player-pill"
              onClick={() => setShowProfileModal(true)}
              title="View profile"
              aria-label={`Logged in as ${pseudo}. Click to view profile.`}
            >
              <img
                src={avatarUrl}
                alt={pseudo ?? 'avatar'}
                style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.src = '/images/users/default.png'; }}
              />
              <span className="topbar-player-pill__name">{pseudo}</span>
            </button>
          )}
          <button
            className="theme-toggle"
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <nav className={`mobile-nav${navVisible ? '' : ' mobile-nav--hidden'}`} aria-label="Navigation mobile">
        <button className="mobile-nav-item" onClick={() => navigate('/leaderboard')}>🏆<span>Board</span></button>
        <button className="mobile-nav-item mobile-nav-item--home" onClick={() => navigate('/')}>🏠<span>Home</span></button>
        <button className="mobile-nav-item" onClick={() => navigate('/feedback')}>🗣️<span>Feedbacks</span></button>
      </nav>
    </>

  );
}
