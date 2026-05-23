import { useEffect, useRef, useState } from 'react';
import type { Player } from './usePlayer';
import './ProfileModal.css';
import { API_URL } from '../config/api';

interface PlayerStats {
  totalPoints: number;
  createdAt: string;
}

interface ProfileModalProps {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const stored = localStorage.getItem('matchit_player');
  const player: Player | null = stored ? JSON.parse(stored) : null;
  const avatarUrl = player?.avatarUrl ?? '/images/users/default.png';
  const avatarBg = player?.avatarBg;

  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (!player?.uuid) { setLoading(false); return; }

    fetch(`${API_URL}/api/leaderboard/player/${player.uuid}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<PlayerStats>;
      })
      .then(data => { setStats(data); setLoading(false); })
      .catch((err) => { console.error('[ProfileModal] fetch failed:', err); setFetchError(true); setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="profile-modal-overlay"
      onClick={onClose}
      aria-label="Close profile"
    >
      <div
        className="profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        onClick={e => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          className="profile-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div
            className="profile-modal__avatar-wrap"
            style={{ backgroundColor: avatarBg ?? 'transparent' }}
        >
          <img
            className="profile-modal__avatar"
            src={avatarUrl}
            alt=""
            aria-hidden="true"
            onError={(e) => { e.currentTarget.src = '/images/users/default.png'; }}
          />
        </div>

        <h2 id="profile-modal-title" className="profile-modal__name">
          {player?.pseudo ?? 'Unknown player'}
        </h2>

        <div className="profile-modal__stats">
          {loading && (
            <p className="profile-modal__loading">Loading stats…</p>
          )}
          {!loading && fetchError && (
            <p className="profile-modal__error">Could not load stats.</p>
          )}
          {!loading && !fetchError && stats && (
            <div className="profile-modal__points">
              <span className="profile-modal__points-value">{stats.totalPoints}</span>
              <span className="profile-modal__points-label">total points</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
