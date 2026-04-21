import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">

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
  );
}