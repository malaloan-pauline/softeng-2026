import { useState, type KeyboardEvent } from 'react';
import { usePlayer } from './usePlayer';
import './UsernameModal.css';

interface UsernameModalProps {
  onClose: () => void;
}

export default function UsernameModal({ onClose }: UsernameModalProps) {
  const { savePlayer } = usePlayer();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  function handleSubmit() {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters.');
      return;
    }
    savePlayer(trimmed);
    onClose();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit();
  }

  return (
    <div className="username-modal-overlay">
      <div className="username-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">

        {/* ─── Profile picture placeholder ────────────────────────────────────────
            Future sprint: replace this div with an avatar <input type="file">.
            On change, read the file as a data URL and pass it to savePlayer() so
            it gets stored in avatarUrl on the Player object (see usePlayer.ts).
            ──────────────────────────────────────────────────────────────────────── */}
        <div className="username-modal__avatar-placeholder" aria-hidden="true">🎮</div>

        <h2 id="modal-title" className="username-modal__title">Welcome to Match IT!</h2>
        <p className="username-modal__subtitle">Choose a username to appear on the leaderboard.</p>

        <input
          className="username-modal__input"
          type="text"
          placeholder="Your username…"
          value={value}
          maxLength={32}
          autoFocus
          onChange={(e) => { setValue(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          aria-label="Username"
        />

        {error && <span className="username-modal__error">{error}</span>}

        <button
          className="username-modal__submit"
          onClick={handleSubmit}
          disabled={value.trim().length < 2}
        >
          Let's play!
        </button>
      </div>
    </div>
  );
}
