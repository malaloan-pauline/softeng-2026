import { useEffect, useRef } from 'react';
import './FeedbacksPage.css';
import BackgroundHalos from '../../components/BackgroundHalos/BackgroundHalos';
import { feedbacks, randomAnonymousName } from '../../data/feedbacks';
import { useNavigate } from 'react-router-dom';

const avgRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;

function Stars({ rating, className }: { rating: number; className: string }) {
  return (
    <span className={className} aria-label={`${rating} out of 5`}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

export default function FeedbacksPage() {
  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="feedbacks-page">
      <BackgroundHalos />
      <button className="back-btn-top" onClick={() => navigate('/')}>
        ← Home
      </button>
      <main className="feedbacks-page__content">

        <section className="feedbacks-hero">
          <span className="feedbacks-eyebrow">Student Feedbacks</span>
          <h1 className="feedbacks-title">What students say</h1>
          <p className="feedbacks-sub">Real opinions from Bachelor Computer Science students</p>
          <div className="feedbacks-avg">
            <Stars rating={Math.round(avgRating)} className="feedbacks-avg__stars" />
            <span className="feedbacks-avg__num">{avgRating.toFixed(1)} / 5</span>
          </div>
        </section>

        <div className="feedbacks-masonry scroll-reveal" ref={gridRef}>
          {feedbacks.map((fb, i) => (
            <div className="fb-card" key={i}>
              <div className="fb-card__accent-bar" />
              <div className="fb-card__header">
                <Stars rating={fb.rating} className="fb-card__stars" />
                <span className="fb-card__author">
                  {fb.anonymous ? randomAnonymousName() : fb.name}
                  {fb.anonymous && <span className="fb-card__anon-tag">anon</span>}
                </span>
              </div>
              <p className="fb-card__opinion">"{fb.opinion}"</p>
              <dl className="fb-card__details">
                <dt>Liked most</dt>
                <dd>{fb.liked}</dd>
                <dt>Fav. subject</dt>
                <dd>{fb.favSubject}</dd>
                <dt>Challenge</dt>
                <dd>{fb.challenge}</dd>
                <dt>Advice</dt>
                <dd>{fb.advice}</dd>
              </dl>
            </div>
          ))}
        </div>

        <footer className="feedbacks-footer">
          Copyright © 2026 match IT — Group C
        </footer>

      </main>
    </div>
  );
}