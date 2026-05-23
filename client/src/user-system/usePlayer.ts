import { useState } from 'react';

export interface Player {
  uuid: string;
  pseudo: string;
  avatarUrl?: string;
  avatarBg?: string;
}

const STORAGE_KEY = 'matchit_player';
const DEFAULT_AVATAR = '/images/users/default.png';

export function usePlayer() {
  const [player, setPlayer] = useState<Player | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Player) : null;
  });

  function savePlayer(pseudo: string, avatarUrl: string = DEFAULT_AVATAR, avatarBg?: string) {
    const newPlayer: Player = {
      uuid: crypto.randomUUID(),
      pseudo,
      avatarUrl,
      avatarBg,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlayer));
    setPlayer(newPlayer);
    window.dispatchEvent(new Event('matchit:player-updated'));
  }

  return { player, savePlayer };
}
