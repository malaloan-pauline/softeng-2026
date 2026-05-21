import type { Player } from './usePlayer';

const STORAGE_KEY = 'matchit_player';

export async function changeUsername(newPseudo: string): Promise<void> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  const player: Player = JSON.parse(stored);
  const updated: Player = { ...player, pseudo: newPseudo };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Notify same-tab listeners immediately (topbar pill, etc.)
  window.dispatchEvent(new CustomEvent('matchit:player-updated'));

  // Sync new pseudo to the database — fire and forget, fail silently
  try {
    await fetch('http://localhost:3000/api/leaderboard/player', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid: player.uuid, pseudo: newPseudo }),
    });
  } catch (err) {
    console.error('[changeUsername] Failed to sync to database:', err);
  }
}
