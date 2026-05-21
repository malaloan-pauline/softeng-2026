import { useState, useEffect, useRef } from "react";
import { API_URL } from '../../config/api';
import { useNavigate } from "react-router-dom";
import "./index.css";
import { submitScore, syncTotalPoints } from '../../user-system/Score';

type Upgrade = {
  id: number;
  name: string;
  cost: number;
  power: number;
  unlockAt: number;
}

type Powerups = {
  id: number;
  name: string;
  cost: number;
  cps: number;
  unlockAt: number;
}

type Milestone = { click: number; fact: string };
type ConfettiParticle = { id: number; x: number; color: string; size: number; duration: number; delay: number };

const CONFETTI_COLORS = ["#e8a0a8","#d4707c","#e8e4d4","#c57269","#9dcba2","#6b9c70","#b9ddc1","#f5d0d4","#2d5a35","#e8e4d4"];

const MILESTONES: Milestone[] = [
  { click: 50,    fact: "First 50 points! The word 'click' was first used to describe a mouse action in 1983." },
  { click: 250,   fact: "250 points! The average person spends 6 hours a day on screens. You're making yours count." },
  { click: 1000,  fact: "1,000 points! The first computer bug was an actual moth found inside a Harvard relay in 1947." },
  { click: 5000,  fact: "5,000 points! WiFi doesn't stand for anything — the name was invented by a marketing firm." },
  { click: 10000, fact: "10,000 points! A programmer's go-to drink is Java ☕ — coincidence? We think not." },
  { click: 50000, fact: "50,000 points! You could fill an Olympic pool with the electricity used by the internet each second." },
];

const UPGRADES: Upgrade[] = [
  { id: 1, name: "Mechanical Keyboard", cost: 25,  power: 10, unlockAt: 10  },
  { id: 2, name: "Dual Monitors",       cost: 200, power: 50, unlockAt: 50  },
  { id: 3, name: "Brainrot",            cost: 500, power: 67, unlockAt: 200 },
];

const POWERUPS: Powerups[] = [
  { id: 1, name: "Matcha Tea",            cost: 250,  cps: 5,   unlockAt: 15  },
  { id: 2, name: "Iced Latte Matcha",     cost: 300,  cps: 10,  unlockAt: 150 },
  { id: 3, name: "Ube Matcha Cheesecake", cost: 4561, cps: 126, unlockAt: 600 },
];

const SCORE_TIERS = [
  { clicks: 1000, points: 8, label: "1000 clicks / 12s" },
  { clicks: 500 , points: 5, label: "500 clicks / 15s" },
  { clicks: 300 , points: 4, label: "300 clicks / 15s" },
  { clicks: 200 , points: 3, label: "200 clicks / 10s" },
  { clicks: 150 , points: 1, label: "150 clicks / 10s" },
];

// Panel background: --c-surface switches automatically via [data-theme="dark"] on <html>
const panel  = "bg-[var(--c-surface)] border border-[var(--c-border)] rounded-2xl p-5 shadow-[rgba(60,80,60,0.12)_0_4px_16px]";

// Buy button: uses accent palette — --c-accent (#f4beca) light, --c-accent-text (#7a3a4a) for text/dark accents
const buyBtn = "self-start px-3.5 py-1.5 text-sm font-semibold rounded-lg border border-[var(--c-accent)] cursor-pointer transition-colors duration-150 bg-[var(--c-accent)] text-[var(--c-accent-text)] enabled:hover:bg-[#f9dfe0] disabled:opacity-40 disabled:cursor-not-allowed";
const row    = "flex flex-col gap-1.5 py-2.5 border-b border-[var(--c-border)] last:border-b-0";
const muted  = "text-sm text-[var(--c-muted)]";
// heading: original #B97375 (salmon) — closest token is --c-accent-text (#7a3a4a); both are pinkish-red tones
const heading = "!text-[var(--c-accent-text)]";


function scaledCost(baseCost: number, count: number) {
  return Math.floor(baseCost * Math.pow(1.15, count));
}

function ClickerGame() {
  const navigate = useNavigate();
  const [click,          setclick]          = useState(0);
  const [clickPower,     setClickPower]     = useState(1);
  const [cps,            setCps]            = useState(0);
  const [powerupCounts,  setPowerupCounts]  = useState<Record<number, number>>({});
  const [upgradeCounts,  setUpgradeCounts]  = useState<Record<number, number>>({});
  const [totalEarned,      setTotalEarned]      = useState(0);
  const [activeMilestone,  setActiveMilestone]  = useState<Milestone | null>(null);
  const [confetti,         setConfetti]         = useState<ConfettiParticle[]>([]);
  const triggeredMilestones = useRef(new Set<number>());
  const [leaderboardPts,   setLeaderboardPts]   = useState(() => Number(sessionStorage.getItem('clicker-lb-pts') ?? 0));
  const [recentScore,      setRecentScore]       = useState(0);
  const timedScores      = useRef<{ t: number; pts: number }[]>([]);
  const awardedTiers     = useRef(new Set<number>());
  const [showGuide,        setShowGuide]        = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  function handleClick() {
    setclick(prev => prev + clickPower);
    setTotalEarned(prev => prev + clickPower);

    const now = Date.now();
    timedScores.current.push({ t: now, pts: clickPower });
    timedScores.current = timedScores.current.filter(s => now - s.t <= 10000);
    const recent = timedScores.current.reduce((sum, s) => sum + s.pts, 0);
    setRecentScore(recent);

    if (recent < SCORE_TIERS[SCORE_TIERS.length - 1].clicks) {
      awardedTiers.current.clear();
    }
    for (const tier of SCORE_TIERS) {
      if (recent >= tier.clicks && !awardedTiers.current.has(tier.clicks)) {
        awardedTiers.current.add(tier.clicks);
        setLeaderboardPts(prev => {
          const next = prev + tier.points;
          sessionStorage.setItem('clicker-lb-pts', String(next));
          return next;
        });
        submitScore({ game: 'clicker', metric: recent, points: tier.points });
      }
    }
  }

  function buyUpgrade(upg: Upgrade) {
    const count = upgradeCounts[upg.id] ?? 0;
    const cost  = scaledCost(upg.cost, count);
    if (click < cost) return;
    setclick(prev => prev - cost);
    setClickPower(prev => prev + upg.power);
    setUpgradeCounts(prev => ({ ...prev, [upg.id]: count + 1 }));
  }

  function buypowerup(powerup: Powerups) {
    const count = powerupCounts[powerup.id] ?? 0;
    const cost  = scaledCost(powerup.cost, count);
    if (click < cost) return;
    setclick(prev => prev - cost);
    setCps(prev => prev + powerup.cps);
    setPowerupCounts(prev => ({ ...prev, [powerup.id]: count + 1 }));
  }

  useEffect(() => {
    const next = MILESTONES.find(m => click >= m.click && !triggeredMilestones.current.has(m.click));
    if (!next) return;
    triggeredMilestones.current.add(next.click);
    setActiveMilestone(next);
    setConfetti(Array.from({ length: 70 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
      duration: 2.2 + Math.random() * 2,
      delay: Math.random() * 0.8,
    })));
    const t = setTimeout(() => { setActiveMilestone(null); setConfetti([]); }, 20000);
    return () => clearTimeout(t);
  }, [click]);

  async function Restart() {
    const stored = localStorage.getItem('matchit_player');
    if (stored && leaderboardPts > 0) {
      try {
        const { uuid } = JSON.parse(stored);
        const res = await fetch(`${API_URL}/api/leaderboard/player/${uuid}`);
        if (res.ok) {
          const player = await res.json();
          const newTotal = Math.max(0, player.totalPoints - leaderboardPts);
          await syncTotalPoints(newTotal);
        }
      } catch {
        // fail silently
      }
    }
    setclick(0);
    setTotalEarned(0);
    setClickPower(1);
    setCps(0);
    setPowerupCounts({});
    setUpgradeCounts({});
    triggeredMilestones.current.clear();
    timedScores.current = [];
    awardedTiers.current.clear();
    setRecentScore(0);
    setLeaderboardPts(0);
    sessionStorage.setItem('clicker-lb-pts', '0');
    setActiveMilestone(null);
    setConfetti([]);
  }

  useEffect(() => {
    if (cps === 0) return;
    const id = setInterval(() => {
      setclick(prev => prev + cps / 10);
      setTotalEarned(prev => prev + cps / 10);
    }, 100);
    return () => clearInterval(id);
  }, [cps]);

  return (
    <div className="min-h-[100svh] bg-[var(--c-bg)] text-[var(--c-text)] flex flex-col items-center px-4 pb-8 transition-colors duration-300" style={{ paddingTop: 'calc(var(--topbar-h) + 2rem)' }}>

      <div className="w-full flex items-center gap-2 mb-2">
        <button
          onClick={() => navigate('/games')}
          className="clicker-nav-btn flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] transition-colors duration-150"
          aria-label="Back to game selection"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          Games
        </button>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setShowGuide(true)}
            className="clicker-nav-btn px-4 py-2 text-sm font-semibold rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] transition-colors duration-150"
          >
            Guide
          </button>
          <button
            onClick={() => setShowRestartConfirm(true)}
            className="px-4 py-2 text-sm font-semibold rounded-lg border border-[var(--c-danger)] bg-[var(--c-surface)] text-[var(--c-danger)] transition-colors duration-150 hover:bg-[#f8c8e4]"
          >
            Restart
          </button>
        </div>
      </div>

      <main className="w-full max-w-[720px] flex flex-col items-center gap-6">

        {showRestartConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setShowRestartConfirm(false)}
          >
            <div
              className={`relative w-full max-w-sm rounded-2xl p-6 shadow-xl ${panel}`}
              onClick={e => e.stopPropagation()}
            >
              <h2 className={`text-lg font-bold mb-2 ${heading}`}>Restart game?</h2>
              <p className={`mb-5 ${muted}`}>All progress, purchases, and points will be lost. This cannot be undone.</p>
              <div className="flex gap-2 mt-1 justify-center">
                <button
                  onClick={() => { Restart(); setShowRestartConfirm(false); }}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-[var(--c-danger)] bg-[var(--c-danger)] text-white hover:bg-red-600 transition-colors duration-150"
                >
                  Yes, Restart
                </button>
                <button
                  onClick={() => setShowRestartConfirm(false)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] hover:bg-[#e8f5e9] transition-colors duration-150 ${heading}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setShowGuide(false)}
          >
            <div
              className={`relative w-full max-w-md rounded-2xl p-6 shadow-xl ${panel}`}
              onClick={e => e.stopPropagation()}
            >
              <h2 className={`text-xl font-bold mb-4 ${heading}`}>How to Play</h2>
              <ul className={`space-y-2 list-disc list-inside ${muted}`}>
                <li>Click <strong>!^oWo^!</strong> to earn points.</li>
                <li><strong>Upgrades</strong> increase points per click.</li>
                <li><strong>Powerups</strong> generate points automatically per second.</li>
                <li>Each purchase raises that item's cost by ×1.15.</li>
                <li>The <strong>×N</strong> badge shows how many times you've bought an item.</li>
                <li>Hit <strong>Restart</strong> to start over from scratch.</li>
              </ul>
              <h3 className={`text-base font-bold mt-5 mb-2 ${heading}`}>🏆 Score</h3>
              <p className={`mb-2 ${muted}`}>Earn score points by clicking fast. Points are tracked over a 10-second window:</p>
              <ul className={`space-y-1 list-disc list-inside ${muted}`}>
                {SCORE_TIERS.map(t => (
                  <li key={t.clicks}><strong>{t.clicks} pts in 10s</strong> → +{t.points} score </li>
                ))}
              </ul>
              <p className={`mt-2 text-xs ${muted}`}>Your score is saved for this session and visible in the bubble at the bottom-right of the screen.</p>
              <button
                onClick={() => setShowGuide(false)}
                className={`mt-5 px-4 py-2 text-sm font-semibold rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] hover:bg-[#e8f5e9] transition-colors duration-150 ${heading}`}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <h1 className="text-[2.5rem] font-bold tracking-[-0.5px] mb-2 !text-[var(--c-primary)] font-pakades">
          Click IT
        </h1>

        <div className="flex justify-center">
          <button
            onClick={handleClick}
            className="clicker-main-btn px-12 py-4 text-2xl font-bold border-2 border-[var(--c-border)] rounded-full cursor-pointer shadow-[rgba(60,80,60,0.12)_0_4px_16px] transition-colors duration-150 active:scale-95"
          >
            !^oWo^!
          </button>
        </div>

        <div className={`flex gap-8 px-8 py-4 rounded-2xl shadow-[rgba(60,80,60,0.12)_0_4px_16px] bg-[var(--c-surface)] border border-[var(--c-border)] ${muted}`}>
          <p>click: <strong>{Math.floor(click)}</strong></p>
          <p>Per click: <strong>{clickPower}</strong></p>
          <p>Per second: <strong>{cps.toFixed(1)}</strong></p>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">

          {UPGRADES.some(u => totalEarned >= u.unlockAt) && (
            <div className={panel}>
              <h3 className={`text-[1.1rem] font-semibold mb-3 ${heading}`}>Upgrades</h3>
              {UPGRADES.map((upg, i) => {
                const unlocked = totalEarned >= upg.unlockAt;
                const isNextLocked = !unlocked && UPGRADES.slice(0, i).every(u => totalEarned >= u.unlockAt);
                if (!unlocked && !isNextLocked) return null;
                if (isNextLocked) return (
                  <div className={`${row} opacity-50`} key={upg.id}>
                    <p className={`${muted} italic`}>??? — unlocks at {upg.unlockAt} pts earned</p>
                  </div>
                );
                const count = upgradeCounts[upg.id] ?? 0;
                const cost  = scaledCost(upg.cost, count);
                return (
                  <div className={row} key={upg.id}>
                    <div className="flex items-center justify-between">
                      <p className={muted}>{upg.name} — +{upg.power} click power</p>
                      {count > 0 && (
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full bg-[var(--c-bg)] ${heading}`}>
                          ×{count}
                        </span>
                      )}
                    </div>
                    <button onClick={() => buyUpgrade(upg)} disabled={click < cost} className={buyBtn}>
                      Buy ({cost} pts)
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {POWERUPS.some(p => totalEarned >= p.unlockAt) && (
            <div className={panel}>
              <h3 className={`text-[1.1rem] font-semibold mb-3 ${heading}`}>Powerups</h3>
              {POWERUPS.map((powerup, i) => {
                const unlocked = totalEarned >= powerup.unlockAt;
                const isNextLocked = !unlocked && POWERUPS.slice(0, i).every(p => totalEarned >= p.unlockAt);
                if (!unlocked && !isNextLocked) return null;
                if (isNextLocked) return (
                  <div className={`${row} opacity-50`} key={powerup.id}>
                    <p className={`${muted} italic`}>??? — unlocks at {powerup.unlockAt} pts earned</p>
                  </div>
                );
                const count = powerupCounts[powerup.id] ?? 0;
                const cost  = scaledCost(powerup.cost, count);
                return (
                  <div className={row} key={powerup.id}>
                    <div className="flex items-center justify-between">
                      <p className={muted}>{powerup.name} — +{powerup.cps} pts/sec</p>
                      {count > 0 && (
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full bg-[var(--c-bg)] ${heading}`}>
                          ×{count}
                        </span>
                      )}
                    </div>
                    <button onClick={() => buypowerup(powerup)} disabled={click < cost} className={buyBtn}>
                      Buy ({cost} pts)
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </main>

      {confetti.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}vw`,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {activeMilestone && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9998] w-[min(92vw,480px)] milestone-toast">
          <div className={`relative rounded-2xl px-5 py-4 shadow-xl border border-[var(--c-border)] ${panel}`}>
            <button
              onClick={() => { setActiveMilestone(null); setConfetti([]); }}
              className={`absolute top-3 right-3 text-lg leading-none px-1 hover:opacity-60 transition-opacity ${heading}`}
              aria-label="Close"
            >
              ×
            </button>
            <p className={`text-base font-bold mb-1 pr-6 ${heading}`}>🎉 Milestone: {activeMilestone.click.toLocaleString()} pts!</p>
            <p className={`text-sm ${muted}`}>{activeMilestone.fact}</p>
          </div>
        </div>
      )}

      <div className={`fixed bottom-5 right-5 z-50 flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-lg border-2 border-[var(--c-border)] bg-[var(--c-primary)] ${recentScore >= SCORE_TIERS[0].clicks ? "ring-2 ring-[var(--c-accent-text)]" : ""}`}>
        <span className="text-lg leading-none">🏆</span>
        <span className="text-xs font-bold leading-tight text-white">{leaderboardPts}</span>
      </div>

      <footer className={`mt-auto pt-8 text-xs text-center ${row}`}>
        <p>Copyrights © 2026 Clicker Game by Match IT</p>
      </footer>
    </div>
  );
}

export default ClickerGame;
