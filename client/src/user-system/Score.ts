import type { Player } from './usePlayer';
import { API_URL } from '../config/api';

export type Game = 'clicker' | 'hangman' | 'tictactoe' | 'onestroke';

const STORAGE_KEY = 'matchit_player';

export async function syncTotalPoints(totalPoints: number): Promise<void> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;
  const { uuid } = JSON.parse(stored);
  try {
    await fetch(`${API_URL}/api/leaderboard/player/points`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid, totalPoints }),
    });
  } catch (err) {
    console.error('Failed to sync total points:', err);
  }
}

interface SubmitScorePayload {
  game: Game;
  metric: number;
  points: number;
}

export async function submitScore({ game, metric, points }: SubmitScorePayload): Promise<void> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  try {
    const { uuid, pseudo, avatarUrl }: Player = JSON.parse(stored);

    const res = await fetch(`${API_URL}/api/leaderboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid, pseudo, avatarUrl, game, metric, points }),
    });

    if (!res.ok) console.error(`[submitScore] HTTP ${res.status}`);
  } catch (err) {
    console.error('[submitScore] failed silently:', err);
  }
}
