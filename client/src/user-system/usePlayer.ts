import { useState } from 'react';

export interface Player {
  uuid: string;
  pseudo: string;
  avatarUrl?: string; // reserved for future profile picture system
}

const STORAGE_KEY = 'matchit_player';

export function usePlayer() {
  const [player, setPlayer] = useState<Player | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Player) : null;
  });

  function savePlayer(pseudo: string) {
    const newPlayer: Player = {
      uuid: crypto.randomUUID(),
      pseudo,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlayer));
    setPlayer(newPlayer);
  }

  return { player, savePlayer };
}
