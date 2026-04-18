import { useState, useEffect, useRef } from "react";

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

type Milestone = { score: number; fact: string };
type ConfettiParticle = { id: number; x: number; color: string; size: number; duration: number; delay: number };

const CONFETTI_COLORS = ["#ff6b6b","#ffd93d","#6bcb77","#4d96ff","#ff922b","#cc5de8","#f06595"];

const MILESTONES: Milestone[] = [
  { score: 50,    fact: "First 50 points! The word 'click' was first used to describe a mouse action in 1983." },
  { score: 250,   fact: "250 points! The average person spends 6 hours a day on screens. You're making yours count." },
  { score: 1000,  fact: "1,000 points! The first computer bug was an actual moth found inside a Harvard relay in 1947." },
  { score: 5000,  fact: "5,000 points! WiFi doesn't stand for anything — the name was invented by a marketing firm." },
  { score: 10000, fact: "10,000 points! A programmer's go-to drink is Java ☕ — coincidence? We think not." },
  { score: 50000, fact: "50,000 points! You could fill an Olympic pool with the electricity used by the internet each second." },
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

const panel  = "bg-[#e8e4d4] dark:bg-[#7c9c80] border border-[#b9ddc1] dark:border-[#2d4a33] rounded-2xl p-5 shadow-[rgba(60,80,60,0.12)_0_4px_16px] dark:shadow-[rgba(0,0,0,0.4)_0_4px_16px]";
//upgrade and powerups menu 

const buyBtn = "self-start px-3.5 py-1.5 text-sm font-semibold rounded-lg border border-[ #c8e6c9] dark:border-[ #2d4a33] cursor-pointer transition-colors duration-150 bg-[ #c8a87a] dark:bg-[ #8b5e3c] text-[ #2a4a2e] dark:text-[ #a8d5a8] enabled:hover:bg-[ #b8946a] dark:enabled:hover:bg-[ #a0714d] disabled:bg-[ #d0cdc8] dark:disabled:bg-[ #4a3f38] disabled:text-[ #7a6a5e] dark:disabled:text-[ #7a6a5e] disabled:cursor-not-allowed";
const row    = "flex flex-col gap-1.5 py-2.5 border-b border-[ #c8e6c9] dark:border-[ #2d4a33] last:border-b-0";
const muted  = "text-sm text-[ #7a6a5e] dark:text-[#4a5e4c]";
//
const heading = "text-[ #2a4a2e] dark:text-[#e8e4d4]";
// Upgrades/Powerups/Clicker btn

function scaledCost(baseCost: number, count: number) {
  return Math.floor(baseCost * Math.pow(1.15, count));
}

function ClickerGame() {
  const [score,          setScore]          = useState(0);
  const [clickPower,     setClickPower]     = useState(1);
  const [cps,            setCps]            = useState(0);
  const [powerupCounts,  setPowerupCounts]  = useState<Record<number, number>>({});
  const [upgradeCounts,  setUpgradeCounts]  = useState<Record<number, number>>({});
  const [totalEarned,      setTotalEarned]      = useState(0);
  const [activeMilestone,  setActiveMilestone]  = useState<Milestone | null>(null);
  const [confetti,         setConfetti]         = useState<ConfettiParticle[]>([]);
  const triggeredMilestones = useRef(new Set<number>());
  const [showGuide,        setShowGuide]        = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  const [dark, setDark] = useState(() => {
    document.documentElement.classList.toggle("dark", prefersDark.matches);
    return prefersDark.matches;
  });

  function handleClick() {
    setScore(prev => prev + clickPower);
    setTotalEarned(prev => prev + clickPower);
  }

  function buyUpgrade(upg: Upgrade) {
    const count = upgradeCounts[upg.id] ?? 0;
    const cost  = scaledCost(upg.cost, count);
    if (score < cost) return;
    setScore(prev => prev - cost);
    setClickPower(prev => prev + upg.power);
    setUpgradeCounts(prev => ({ ...prev, [upg.id]: count + 1 }));
  }

  function buypowerup(powerup: Powerups) {
    const count = powerupCounts[powerup.id] ?? 0;
    const cost  = scaledCost(powerup.cost, count);
    if (score < cost) return;
    setScore(prev => prev - cost);
    setCps(prev => prev + powerup.cps);
    setPowerupCounts(prev => ({ ...prev, [powerup.id]: count + 1 }));
  }

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => {
      setDark(e.matches);
      document.documentElement.classList.toggle("dark", e.matches);
    };
    prefersDark.addEventListener('change', handler);
    return () => prefersDark.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const next = MILESTONES.find(m => totalEarned >= m.score && !triggeredMilestones.current.has(m.score));
    if (!next) return;
    triggeredMilestones.current.add(next.score);
    setActiveMilestone(next);
    setConfetti(Array.from({ length: 70 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
      duration: 2.2 + Math.random() * 2,
      delay: Math.random() * 0.8,
    })));
    const t = setTimeout(() => { setActiveMilestone(null); setConfetti([]); }, 5000);
    return () => clearTimeout(t);
  }, [totalEarned]);

  function reset() {
    setScore(0);
    setTotalEarned(0);
    setClickPower(1);
    setCps(0);
    setPowerupCounts({});
    setUpgradeCounts({});
    triggeredMilestones.current.clear();
    setActiveMilestone(null);
    setConfetti([]);
  }

  function switchTheme() {
    const isDark = !dark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }

  useEffect(() => {
    if (cps === 0) return;
    const id = setInterval(() => {
      setScore(prev => prev + cps / 10);
      setTotalEarned(prev => prev + cps / 10);
    }, 100);
    return () => clearInterval(id);
  }, [cps]);

  return (
    <div className="min-h-[100svh] bg-[#e8f5e9] dark:bg-[#558550] text-[#3b2f2f] dark:text-[#f5f0e8] font-sans flex flex-col items-center px-4 py-8 transition-colors duration-300">
      <main className="w-full max-w-[720px] flex flex-col items-center gap-6">

        <div className="w-full flex justify-end gap-2">
          <button
            onClick={() => setShowGuide(true)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg border border-[#c8e6c9] dark:border-[#2d4a33] bg-white dark:bg-[#2d5a35] transition-colors duration-150 hover:bg-[#e8f5e9] dark:hover:bg-[#3a7045] ${heading}`}
          >
            Guide
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 text-sm font-semibold rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-red-950 text-red-600 dark:text-red-400 transition-colors duration-150 hover:bg-red-50 dark:hover:bg-red-900"
          >
            Reset
          </button>
          <button
            onClick={switchTheme}
            className={`px-4 py-2 text-sm font-semibold rounded-lg border border-[#c8e6c9] dark:border-[#2d4a33] bg-white dark:bg-[#2d5a35] transition-colors duration-150 hover:bg-[#e8f5e9] dark:hover:bg-[#3a7045] ${heading}`}
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {showResetConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setShowResetConfirm(false)}
          >
            <div
              className={`relative w-full max-w-sm rounded-2xl p-6 shadow-xl ${panel}`}
              onClick={e => e.stopPropagation()}
            >
              <h2 className={`text-lg font-bold mb-2 ${heading}`}>Reset game?</h2>
              <p className={`mb-5 ${muted}`}>All progress, purchases, and points will be lost. This cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => { reset(); setShowResetConfirm(false); }}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-150"
                >
                  Yes, reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg border border-[#c8e6c9] dark:border-[#2d4a33] bg-white dark:bg-[#2d5a35] hover:bg-[#e8f5e9] dark:hover:bg-[#3a7045] transition-colors duration-150 ${heading}`}
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
                <li>Click <strong>Bleh!</strong> to earn points.</li>
                <li><strong>Upgrades</strong> increase points per click.</li>
                <li><strong>Powerups</strong> generate points automatically per second.</li>
                <li>Each purchase raises that item's cost by ×1.15.</li>
                <li>The <strong>×N</strong> badge shows how many times you've bought an item.</li>
                <li>Hit <strong>Reset</strong> to start over from scratch.</li>
              </ul>
              <button
                onClick={() => setShowGuide(false)}
                className={`mt-5 px-4 py-2 text-sm font-semibold rounded-lg border border-[#c8e6c9] dark:border-[#2d4a33] bg-white dark:bg-[#2d5a35] hover:bg-[#e8f5e9] dark:hover:bg-[#3a7045] transition-colors duration-150 ${heading}`}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <h1 className={`text-[2.5rem] font-bold tracking-[-0.5px] mb-2 ${heading}`}>
          Clicker Game
        </h1>

        <div className="flex justify-center">
          <button
            onClick={handleClick}
            className={`px-12 py-4 text-2xl font-bold border-2 border-[#c8e6c9] dark:border-[#2d4a33] rounded-full cursor-pointer shadow-[rgba(60,80,60,0.12)_0_4px_16px] dark:shadow-[rgba(0,0,0,0.4)_0_4px_16px] transition-colors duration-150 bg-[#a5c8a5] dark:bg-[#2d5a35] hover:bg-[#8fb88f] dark:hover:bg-[#3a7045] active:scale-95 ${heading}`}
          >
            Bleh!
          </button>
        </div>

        <div className={`flex gap-8 px-8 py-4 rounded-2xl shadow-[rgba(60,80,60,0.12)_0_4px_16px] dark:shadow-[rgba(0,0,0,0.4)_0_4px_16px] bg-[#f5f0e8] dark:bg-[#3d2b1f] border border-[#c8e6c9] dark:border-[#2d4a33] ${muted}`}>
          <p>Score: <span className={`font-bold text-xl ${heading}`}>{Math.floor(score)}</span></p>
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
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full bg-[#c8e6c9] dark:bg-[#2d4a33] ${heading}`}>
                          ×{count}
                        </span>
                      )}
                    </div>
                    <button onClick={() => buyUpgrade(upg)} disabled={score < cost} className={buyBtn}>
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
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full bg-[#c8e6c9] dark:bg-[#2d4a33] ${heading}`}>
                          ×{count}
                        </span>
                      )}
                    </div>
                    <button onClick={() => buypowerup(powerup)} disabled={score < cost} className={buyBtn}>
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
          <div className={`rounded-2xl px-5 py-4 shadow-xl border border-[#b9ddc1] dark:border-[#2d4a33] ${panel}`}>
            <p className={`text-base font-bold mb-1 ${heading}`}>🎉 Milestone: {activeMilestone.score.toLocaleString()} pts!</p>
            <p className={`text-sm ${muted}`}>{activeMilestone.fact}</p>
          </div>
        </div>
      )}

      <footer className={`mt-8 text-xs text-center ${muted}`}>
        <p>Copyrights © 2026 Clicker Game by Match IT</p>
      </footer>
    </div>
  );
}

export default ClickerGame;
