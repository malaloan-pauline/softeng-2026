import { useState, type KeyboardEvent } from 'react';
import { usePlayer } from './usePlayer';
import './index.css';

const AVATAR_COUNT = 10;
const AVATAR_BG_COLORS = [
  { hex: '#b5c99a', label: 'Sage' },
  { hex: '#f4c97a', label: 'Amber' },
  { hex: '#9ec5d4', label: 'Sky' },
  { hex: '#e8a0a0', label: 'Rose' },
  { hex: '#c3aee8', label: 'Lavender' },
  { hex: '#a8d4b8', label: 'Mint' },
];


const DEFAULT_AVATAR = '/images/users/default.png';

interface UsernameModalProps {
  onClose: () => void;
}

export default function UsernameModal({ onClose }: UsernameModalProps) {
  const { savePlayer } = usePlayer();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [avatarVariant, setAvatarVariant] = useState<'light' | 'dark'>('light');
  const [selectedBg, setSelectedBg] = useState<string>(AVATAR_BG_COLORS[0].hex);

  function getAvatarUrl(index: number, variant: 'light' | 'dark') {
    return `/images/users/${variant}/avatar${index + 1}.png`;
  }

  function getSelectedAvatarUrl() {
    if (selectedIndex === null) return DEFAULT_AVATAR;
    return getAvatarUrl(selectedIndex, avatarVariant);
  }

  function handleSubmit() {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters.');
      return;
    }
    savePlayer(trimmed, getSelectedAvatarUrl(), selectedIndex !== null ? selectedBg : undefined);
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

        <div className="username-modal__preview">
          <div
              className="username-modal__preview-circle"
              style={{ backgroundColor: selectedIndex !== null ? selectedBg : 'transparent' }}
          >
            <img
                src={getSelectedAvatarUrl()}
                alt="Your avatar preview"
                className="username-modal__preview-img"
                onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
            />
          </div>
        </div>

        <div className="unsername-modal__section-label">Choose a head</div>
        <div className="username-modal__avatar-grid" role="group" aria-label="Choose an avatar">
          {Array.from({ length: AVATAR_COUNT }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`username-modal__avatar-btn${selectedIndex === i ? ' username-modal__avatar-btn--selected' : ''}`}
              onClick={() => setSelectedIndex(i)}
              aria-pressed={selectedIndex === i}
              aria-label={`Avatar ${i + 1}`}
            >
              <div
                className="username-modal__avatar-thumb-wrap"
                style={{backgroundColor : selectedIndex === i ? selectedBg : 'var(-cc-surface, #fdf8ee'}}
                >
              <img
                  src={getAvatarUrl(i, avatarVariant)}
                  alt="" className="username-modal__avatar-img"
                  onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }} />
              </div>
            </button>
          ))}
        </div>
        
        <div className="username-modal__variant-row" role="group" aria-label="Avatar style">
          <div className="username-modal__section-label" style={{ marginBottom: 0 }}>Style</div>
          <div className="username-modal__variant-toggle">
            <button
                type="button"
                className={`username-modal__variant-btn${avatarVariant === 'light' ? ' username-modal__variant-btn--active' : ''}`}
                onClick={() => setAvatarVariant('light')}
                aria-pressed={avatarVariant === 'light'}
            >
              ☀ Light
            </button>
            <button
                type="button"
                className={`username-modal__variant-btn${avatarVariant === 'dark' ? ' username-modal__variant-btn--active' : ''}`}
                onClick={() => setAvatarVariant('dark')}
                aria-pressed={avatarVariant === 'dark'}
            >
              ☾ Dark
            </button>
          </div>
        </div>

        <div className="username-modal__section-label">Background color</div>
        <div className="username-modal__bg-row" role="group" aria-label="Choose background color">
          {AVATAR_BG_COLORS.map(({ hex, label }) => (
              <button
                  key={hex}
                  type="button"
                  className={`username-modal__bg-swatch${selectedBg === hex ? ' username-modal__bg-swatch--selected' : ''}`}
                  style={{ backgroundColor: hex }}
                  onClick={() => setSelectedBg(hex)}
                  aria-pressed={selectedBg === hex}
                  aria-label={label}
                  title={label}
              />
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
