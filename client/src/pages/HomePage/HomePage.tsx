import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useMemo } from 'react';
import {feedbacks, randomAnonymousName} from '../../data/feedbacks';
import './HomePage.css';
import logo from '../../assets/name_logo.png';
import icon from '../../assets/icon.png';
import iconDark from '../../assets/icon_light.png';
import logoDark from '../../assets/name_logo_light.png';
import { anonymousNames } from '../../data/feedbacks';

export default function HomePage() {
  const navigate = useNavigate();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

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

  const preview = useMemo(() => [...feedbacks].sort(() => Math.random() - 0.5).slice(0, 4), []);

  return (
    <div className="home-page">
      {/* Halos de fond */}
      <div className="bg-halos" aria-hidden="true">
        <div className="halo halo-green" />
        <div className="halo halo-pink" />
        <div className="halo halo-green-bottom" />
      </div>

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
          <img src={icon} alt="" className="hero-icon hero-icon--light" aria-hidden="true" />
          <img src={iconDark} alt="" className="hero-icon hero-icon--dark" aria-hidden="true" />
          <h1 className="hero-title animate-in" style={{ '--delay': '80ms' } as React.CSSProperties}>
            <img src={logo} alt="match IT" className="hero-logo hero-logo--light" />
            <img src={logoDark} alt="match IT" className="hero-logo hero-logo--dark" />
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
            {preview.map((fb, i) => (
              <div className="feedback-card" key={i}>
                <div className="feedback-accent-bar" />
                <div className="feedback-stars">{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</div>
                <p className="feedback-text">"{fb.advice}"</p>
                <span className="feedback-author">
                  {fb.anonymous ? randomAnonymousName() : fb.name}
                  {fb.anonymous && <span className="feedback-anon-tag">anon</span>}
                </span>
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