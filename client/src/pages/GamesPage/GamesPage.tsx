import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './GamesPage.css';
import BackgroundHalos from '../../components/BackgroundHalos/BackgroundHalos';

const GAMES = [
  {
    title: 'Hangman',
    description: 'Guess the hidden word letter by letter before the computer crashes. The words are Computer Science related!',
    route: '/games/hangman',
    emoji: '🔤',
  },
  {
    title: 'Clicker',
    description: 'Click as fast as you can and beat the high score.',
    route: '/games/clicker',
    emoji: '👆',
  },
  {
    title: 'Tic Tac Toe',
    description: 'Classic three in a row. Beat the AI!',
    route: '/games/tictactoe',
    emoji: '⬜',
  },
  {
    title: 'One Stroke',
    description: 'Draw each puzzle in a single continuous stroke without lifting your pen. Harder than you think...',
    route: '/games/onestroke',
    emoji: '✏️',
  },
];

export default function GamesPage() {
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
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="games-page">
      <BackgroundHalos />
      <main className="games-page__content">

        <section className="games-hero">
          <span className="games-eyebrow">Pick your game</span>
          <h1 className="games-title">Games</h1>
          <p className="games-sub">Choose a challenge and put your CS knowledge to the test.</p>
        </section>

        <div className="games-grid scroll-reveal" ref={gridRef}>
          {GAMES.map((game) => (
            <div className="game-card" key={game.route}>
              <span className="game-card__emoji" aria-hidden="true">{game.emoji}</span>
              <h2 className="game-card__title">{game.title}</h2>
              <p className="game-card__desc">{game.description}</p>
              <button
                className="game-card__btn"
                onClick={() => navigate(game.route)}
              >
                Play
              </button>
            </div>
          ))}
        </div>

        <footer className="games-footer">
          Copyright © 2026 match IT — Group C
        </footer>

      </main>
    </div>
  );
}