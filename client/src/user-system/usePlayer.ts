import { useState } from 'react';
import { API_URL } from '../config/api';

export interface Player {
  uuid: string;
  pseudo: string;
  avatarUrl?: string;
}

const STORAGE_KEY = 'matchit_player';
const DEFAULT_AVATAR = '/images/users/default.png';

export function usePlayer() {
  const [player, setPlayer] = useState<Player | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Player) : null;
  });

  async function savePlayer(pseudo: string, avatarUrl: string = DEFAULT_AVATAR, avatarBg?: string) {
    const newPlayer: Player = {
      uuid: crypto.randomUUID(),
      pseudo,
      avatarUrl,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlayer));
    setPlayer(newPlayer);
    window.dispatchEvent(new Event('matchit:player-updated'));
    try {
      await fetch(`${API_URL}/api/leaderboard/player`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid: newPlayer.uuid, pseudo, avatarUrl: newPlayer.avatarUrl, avatarBg }),
      });
    } catch (err) {
      console.error('[savePlayer] failed to register player:', err);
    }
  }

  return { player, savePlayer };
}
