import { useState, useEffect } from "react";

type Upgrade = {
  id: number;
  name: string;
  cost: number;
  power: number;
}

type Powerups = {
  id: number;
  name: string;
  cost: number;
  cps: number;
}

const UPGRADES: Upgrade[] = [
  { id: 1, name: "Mechanical Keyboard", cost: 25,  power: 10 },
  { id: 2, name: "Dual Monitors",       cost: 200, power: 50 },
  { id: 3, name: "Brainrot",            cost: 500, power: 67 },
];

const POWERUPS: Powerups[] = [
  { id: 1, name: "Matcha Tea",            cost: 250,  cps: 5   },
  { id: 2, name: "Iced Latte Matcha",     cost: 300,  cps: 10  },
  { id: 3, name: "Ube Matcha Cheesecake", cost: 4561, cps: 126 },
];

const panel  = "bg-[#f5f0e8] dark:bg-[#3d2b1f] border border-[#c8e6c9] dark:border-[#2d4a33] rounded-2xl p-5 shadow-[rgba(60,80,60,0.12)_0_4px_16px] dark:shadow-[rgba(0,0,0,0.4)_0_4px_16px]";
const buyBtn = "self-start px-3.5 py-1.5 text-sm font-semibold rounded-lg border border-[#c8e6c9] dark:border-[#2d4a33] cursor-pointer transition-colors duration-150 bg-[#c8a87a] dark:bg-[#8b5e3c] text-[#2a4a2e] dark:text-[#a8d5a8] enabled:hover:bg-[#b8946a] dark:enabled:hover:bg-[#a0714d] disabled:bg-[#d0cdc8] dark:disabled:bg-[#4a3f38] disabled:text-[#7a6a5e] dark:disabled:text-[#7a6a5e] disabled:cursor-not-allowed";
const row    = "flex flex-col gap-1.5 py-2.5 border-b border-[#c8e6c9] dark:border-[#2d4a33] last:border-b-0";
const muted  = "text-sm text-[#7a6a5e] dark:text-[#c4b5a5]";
const heading = "text-[#2a4a2e] dark:text-[#a8d5a8]";

function ClickerGame() {
  const [score,      setScore]      = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [cps,        setCps]        = useState(0);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  const [dark, setDark] = useState(() => {
    document.documentElement.classList.toggle("dark", prefersDark.matches);
    return prefersDark.matches;
  });

  function handleClick() {
    setScore(prev => prev + clickPower);
  }

  function buyUpgrade(upg: Upgrade) {
    if (score < upg.cost) return;
    setScore(prev => prev - upg.cost);
    setClickPower(prev => prev + upg.power);
  }

  function buypowerup(powerup: Powerups) {
    if (score < powerup.cost) return;
    setScore(prev => prev - powerup.cost);
    setCps(prev => prev + powerup.cps);
  }

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => {
      setDark(e.matches);
      document.documentElement.classList.toggle("dark", e.matches);
    };
    prefersDark.addEventListener('change', handler);
    return () => prefersDark.removeEventListener('change', handler);
  }, []);

  function switchTheme() {
    const isDark = !dark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }

  useEffect(() => {
    if (cps === 0) return;
    const id = setInterval(() => setScore(prev => prev + cps / 10), 100);
    return () => clearInterval(id);
  }, [cps]);

  return (
    <div className="min-h-[100svh] bg-[#e8f5e9] dark:bg-[#558550] text-[#3b2f2f] dark:text-[#f5f0e8] font-sans flex flex-col items-center px-4 py-8 transition-colors duration-300">
      <main className="w-full max-w-[720px] flex flex-col items-center gap-6">

        <div className="w-full flex justify-end">
          <button
            onClick={switchTheme}
            className={`px-4 py-2 text-sm font-semibold rounded-lg border border-[#c8e6c9] dark:border-[#2d4a33] bg-white dark:bg-[#2d5a35] transition-colors duration-150 hover:bg-[#e8f5e9] dark:hover:bg-[#3a7045] ${heading}`}
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

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

          <div className={panel}>
            <h3 className={`text-[1.1rem] font-semibold mb-3 ${heading}`}>Upgrades</h3>
            {UPGRADES.map(upg => (
              <div className={row} key={upg.id}>
                <p className={muted}>{upg.name} — +{upg.power} click power</p>
                <button
                  onClick={() => buyUpgrade(upg)}
                  disabled={score < upg.cost}
                  className={buyBtn}
                >
                  Buy ({upg.cost} pts)
                </button>
              </div>
            ))}
          </div>

          <div className={panel}>
            <h3 className={`text-[1.1rem] font-semibold mb-3 ${heading}`}>Powerups</h3>
            {POWERUPS.map(powerup => (
              <div className={row} key={powerup.id}>
                <p className={muted}>{powerup.name} — +{powerup.cps} pts/sec</p>
                <button
                  onClick={() => buypowerup(powerup)}
                  disabled={score < powerup.cost}
                  className={buyBtn}
                >
                  Buy ({powerup.cost} pts)
                </button>
              </div>
            ))}
          </div>

        </div>

      </main>
      <footer className={`mt-8 text-xs text-center ${muted}`}>
        <p>Copyrights © 2026 Clicker Game by Match IT</p>
      </footer>
    </div>
  );
}

export default ClickerGame;
