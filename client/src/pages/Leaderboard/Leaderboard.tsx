import * as React from 'react';
import './index.css';
import BackgroundHalos from '../../components/BackgroundHalos/BackgroundHalos';
 
export interface Player {
  id: number;
  pseudo: string;
  uuid: string;
  totalPoints: number;
  createdAt: string;
}
 
export interface LeaderboardProps {
  /** Called when the user taps the back arrow. Defaults to history.back(). */
  onBack?: () => void;
  /** Initial theme. Falls back to localStorage, then prefers-color-scheme. */
  initialTheme?: 'light' | 'dark';
  /** Optional id of the current player (uuid from localStorage). */
  currentUserUuid?: string;
}
 
// Turns the username into a two letter circle -> placeholder, might put profile pictures
function initialsFor(name: string): string {
  const parts = name.replace(/[._-]/g, ' ').split(' ').filter(Boolean);
  const a = (parts[0] || '?')[0] || '';
  const b = parts[1] ? parts[1][0] : ((parts[0] || '')[1] || '');
  return (a + b).toUpperCase();
}
 
// Top 3 Podium card
interface PodiumCardProps {
  place: 1 | 2 | 3;
  player: Player;
  isMe: boolean;
}
 
const PodiumCard: React.FC<PodiumCardProps> = ({ place, player, isMe }) => (
  <div className={`pod pod--${place}`}>
    <div className="ring">
      <div className="rank">{place}</div>
      <div className="medal" aria-hidden="true">🥇</div>
    </div>
    <div className="name">
      {player.pseudo}
      {isMe && <span className="you-tag">you</span>}
    </div>
    <div className="score-pill">
      {player.totalPoints.toLocaleString()} <span className="pts">pts</span>
    </div>
  </div>
);
 
// List row
interface ListRowProps {
  place: number;
  player: Player;
  isMe: boolean;
}
 
const ListRow: React.FC<ListRowProps> = ({ place, player, isMe }) => (
  <div className="row">
    <div className="rank-num">{place}</div>
    <div className="avatar">
      <span>{initialsFor(player.pseudo)}</span>
    </div>
    <div>
      <div className="name">
        {player.pseudo}
        {isMe && <span className="you-tag">you</span>}
      </div>
    </div>
    <div className="total">
      {player.totalPoints.toLocaleString()}
      <small>total</small>
    </div>
  </div>
);
 
// Main
const Leaderboard: React.FC<LeaderboardProps> = ({
  onBack,
  initialTheme,
  currentUserUuid,
}) => {
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError]     = React.useState<string | null>(null);
 
  // Resolve current user uuid from prop or localStorage
  const myUuid = currentUserUuid ?? (typeof window !== 'undefined'
    ? window.localStorage.getItem('uuid') ?? ''
    : '');
 
  // Fetch leaderboard from backend
  React.useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('http://localhost:3000/api/leaderboard');
        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        const data: Player[] = await res.json();
        // Sort by totalPoints descending (backend already does this, but ensuring)
        data.sort((a, b) => b.totalPoints - a.totalPoints);
        setPlayers(data);
      } catch (err) {
        console.error(err);
        setError('Could not load leaderboard. Please try again.');
      } finally {
        setLoading(false);
      }
    }
 
    fetchLeaderboard();
  }, []);
 
  const top3 = players.slice(0, 3);
  const rest  = players.slice(3);
  const me    = players.find(p => p.uuid === myUuid);
 
  return (
     <div data-screen-label="Leaderboard" className="leaderboard-root">
 
      <header className="chrome">
        <button
          className="pill"
          type="button"
          onClick={() => (onBack ? onBack() : window.history.back())}
        >
          <span className="arrow">←</span> Home
        </button>
      </header>
 <BackgroundHalos />
      <main>
        <h1 className="title">Leaderboard</h1>
        <p className="subtitle">
          Are ya winning, son? ;3c
        </p>
 
        {/* Loading msg */}
        {loading && (
          <div className="state-msg">
            <p>Fishing fishies to get scores…</p>
          </div>
        )}
 
        {/* Error msg */}
        {error && (
          <div className="state-msg state-msg--error">
            <p>{error}</p>
          </div>
        )}
 
        {/* No scores msg */}
        {!loading && !error && players.length === 0 && (
          <div className="state-msg">
            <p>No scores, yet! Be the first to win!</p>
          </div>
        )}
 
        {/* Top 3 Podium */}
        {!loading && !error && top3.length > 0 && (
          <section className="podium" aria-label="Top three">
            {top3.map((p, i) => (
              <PodiumCard
                key={p.id}
                place={(i + 1) as 1 | 2 | 3}
                player={p}
                isMe={p.uuid === myUuid}
              />
            ))}
          </section>
        )}
 
        {/* Rest of list */}
        {!loading && !error && rest.length > 0 && (
          <section className="list-card" aria-label="Ranked players">
            {rest.map((p, idx) => (
              <ListRow
                key={p.id}
                place={idx + 4}
                player={p}
                isMe={p.uuid === myUuid}
              />
            ))}
          </section>
        )}
      </main>
 
      {/* Shows current user's total */}
      {me && (
        <div className="float-trophy" aria-hidden="true">
          <div className="t">🏆</div>
          <div className="v">{me.totalPoints.toLocaleString()}</div>
        </div>
      )}
 
      <footer>Copyright © 2026 match IT by Group C</footer>
    </div>
  );
};
 
export default Leaderboard;