import type { Player } from './usePlayer';

const STORAGE_KEY = 'matchit_player';

export function changeUsername(newPseudo: string): Player | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  const player: Player = JSON.parse(stored);
  const updated: Player = { ...player, pseudo: newPseudo };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Notify same-tab listeners (cross-tab updates arrive via the native storage event)
  window.dispatchEvent(new CustomEvent('matchit:player-updated'));

  return updated;
}
