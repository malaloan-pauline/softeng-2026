import { useState, type KeyboardEvent } from 'react';
import { usePlayer } from './usePlayer';
import './index.css';

const AVATARS = [
  '/images/users/avatar1.png',
  '/images/users/avatar2.png',
  '/images/users/avatar3.png',
  '/images/users/avatar4.png',
  '/images/users/avatar5.png',
  '/images/users/avatar6.png',
];

const DEFAULT_AVATAR = '/images/users/default.png';

interface UsernameModalProps {
  onClose: () => void;
}

export default function UsernameModal({ onClose }: UsernameModalProps) {
  const { savePlayer } = usePlayer();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  function handleSubmit() {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters.');
      return;
    }
    console.log(selectedAvatar);
    savePlayer(trimmed, selectedAvatar ?? DEFAULT_AVATAR);
    onClose();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit();
  }

  function handleGuest() {
    const digits = Math.floor(1000 + Math.random() * 9000);
    savePlayer(`Guest_${digits}`, DEFAULT_AVATAR);
    onClose();
  }

  return (
    <div className="username-modal-overlay">
      <div className="username-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">

        <h2 id="modal-title" className="username-modal__title">Welcome to Match IT!</h2>
        <p className="username-modal__subtitle">Pick an avatar and choose a username.</p>

        <div className="username-modal__avatar-grid" role="group" aria-label="Choose an avatar">
          {AVATARS.map((url) => (
            <button
              key={url}
              type="button"
              className={`username-modal__avatar-btn${selectedAvatar === url ? ' username-modal__avatar-btn--selected' : ''}`}
              onClick={() => setSelectedAvatar(url)}
              aria-pressed={selectedAvatar === url}
              aria-label={`Avatar ${url.match(/avatar(\d+)/)?.[1]}`}
            >
              <img src={url} alt="" className="username-modal__avatar-img" onError={(e) => { e.currentTarget.src = '/images/users/default.png'; }} />
            </button>
          ))}
        </div>

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

        <button className="username-modal__guest" onClick={handleGuest}>
          Continue as Guest
        </button>

        <button
          className="username-modal__submit"
          onClick={handleSubmit}
          disabled={value.trim().length < 2}
        >
          Let's go →
        </button>
      </div>
    </div>
  );
}
