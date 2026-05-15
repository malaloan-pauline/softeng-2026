import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
      <div className="home-page">
        <div className="page-wrapper">
          {/* THEME TOGGLE */}
          <button className="theme-btn" onClick={toggleTheme} aria-label="Switch theme">
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* SIDEBAR — desktop only */}
          <aside className="sidebar">
            <div className="sidebar-card card-leaderboard" onClick={() => navigate('/leaderboard')}>
              Leaderboard
            </div>
            <div className="sidebar-card card-qr">
              QR Code
            </div>
          </aside>

          {/* MAIN */}
          <main className="main">
            <h1 className="site-title">MATCH IT</h1>

            <nav className="nav-buttons">
              <button className="nav-btn" onClick={() => navigate('/games')}> Games</button>
              <button className="nav-btn" onClick={() => navigate('/games/quiz')}> IT Match Quiz</button>
              <button className="nav-btn" onClick={() => navigate('/feedback')}> Students Feedback</button>
            </nav>

            <section className="feedbacks-section">
              <p className="feedbacks-title">— Feedbacks —</p>
              <div className="feedback-list">
                <div className="feedback-card">
                  <span className="feedback-author">Student 1</span>
                  <span className="feedback-stars">★★★★★</span>
                  <span className="feedback-text">"Great ! "</span>
                </div>
                <div className="feedback-card">
                  <span className="feedback-author">Student 2</span>
                  <span className="feedback-stars">★★★★☆</span>
                  <span className="feedback-text">"Amazing"</span>
                </div>
                <div className="feedback-card">
                  <span className="feedback-author">Student 3</span>
                  <span className="feedback-stars">★★★★★</span>
                  <span className="feedback-text">"Super ! "</span>
                </div>
              </div>
            </section>

            <footer className="page-footer">
              Copyright © 2026 Match IT by Group C
            </footer>
          </main>

          {/* MOBILE BOTTOM NAV */}
          <nav className="mobile-nav-bar">
            <div className="mobile-nav-item" onClick={() => navigate('/leaderboard')}>
                Leaderboard
            </div>
            <div className="mobile-nav-item">
                Home
            </div>
            <div className="mobile-nav-item">
                QR Code
            </div>
          </nav>

        </div>
      </div>
    );
  }
