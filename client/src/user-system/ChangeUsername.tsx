import { useState, type KeyboardEvent } from 'react';
import { changeUsername } from './useChangeUsername';
import './index.css';

interface ChangeUsernameModalProps {
  currentPseudo: string;
  onSave: () => void;
  onCancel: () => void;
}

export default function ChangeUsernameModal({ currentPseudo, onSave, onCancel }: ChangeUsernameModalProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  async function handleSave() {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters.');
      return;
    }
    await changeUsername(trimmed);
    onSave();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { void handleSave(); }
  }

  return (
    <div className="username-modal-overlay">
      <div className="username-modal" role="dialog" aria-modal="true" aria-labelledby="change-modal-title">

        <h2 id="change-modal-title" className="username-modal__title">Change Username</h2>
        <p className="username-modal__current">
          Current username: <strong>{currentPseudo}</strong>
        </p>

        <input
          className="username-modal__input"
          type="text"
          placeholder="New username…"
          value={value}
          maxLength={32}
          autoFocus
          onChange={(e) => { setValue(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          aria-label="New username"
        />

        {error && <span className="username-modal__error">{error}</span>}

        <button
          className="username-modal__submit"
          onClick={() => { void handleSave(); }}
          disabled={value.trim().length < 2}
        >
          Save
        </button>

        <button className="username-modal__cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
