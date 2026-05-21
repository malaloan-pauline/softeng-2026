import type { Player } from './usePlayer';

export type Game = 'clicker' | 'hangman' | 'tictactoe' | 'onestroke';

interface SubmitScorePayload {
  game: Game;
  metric: number;
  points: number;
}

const STORAGE_KEY = 'matchit_player';

export async function submitScore({ game, metric, points }: SubmitScorePayload): Promise<void> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  try {
    const { uuid, pseudo, avatarUrl }: Player = JSON.parse(stored);

    const res = await fetch('http://localhost:3000/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid, pseudo, avatarUrl, game, metric, points }),
    });

    if (!res.ok) console.error(`[submitScore] HTTP ${res.status}`);
  } catch (err) {
    console.error('[submitScore] failed silently:', err);
  }
}
