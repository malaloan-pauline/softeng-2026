import { useState, useEffect } from "react";
import './index.css'

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
  cps: number
}

const UPGRADES: Upgrade[] = [
  { id: 1, name: "Mechanical Keyboard", cost: 25,  power: 10 },
  { id: 2, name: "Dual Monitors",       cost: 200, power: 50 },
  { id: 3, name: "Brainrot",            cost: 500, power: 67 },
];

const POWERUPS: Powerups[] = [
  { id: 1, name: "Iced Latte Matcha",       cost: 300,  cps: 17 },
  { id: 2, name: "Ube Matcha Cheesecake",   cost: 4561,  cps: 126  },
];

function ClickerGame() {
  const [score,      setScore]      = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [cps,        setCps]        = useState(0);

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
    if (cps === 0) return;
    const id = setInterval(() => {
      setScore(prev => prev + cps / 10);
    }, 100);
    return () => clearInterval(id);
  }, [cps]);

  return (
    <div id="container">
      <main>

        <h1>Clicker Game</h1>

        <div id="clicker">
          <button id="clicker-btn" onClick={handleClick}>Bleh!</button>
        </div>

        <div id="score">
          <p>Score: <span id="score-value">{Math.floor(score)}</span></p>
          <p>Per click: <strong>{clickPower}</strong></p>
          <p>Per second: <strong>{cps.toFixed(1)}</strong></p>
        </div>

        <div className="shop">
          <div className="upgrades">
            <h3>Upgrades</h3>
            {UPGRADES.map(upg => (
              <div className="upgrade" key={upg.id}>
                <p>{upg.name} — +{upg.power} click power</p>
                <button
                  className="buy-btn"
                  onClick={() => buyUpgrade(upg)}
                  disabled={score < upg.cost}
                >
                  Buy ({upg.cost} pts)
                </button>
              </div>
            ))}
          </div>

          <div className="powerups">
            <h3>Powerups</h3>
            {POWERUPS.map(powerup => (
              <div className="powerup" key={powerup.id}>
                <p>{powerup.name} — +{powerup.cps} pts/sec</p>
                <button
                  className="buy-btn"
                  onClick={() => buypowerup(powerup)}
                  disabled={score < powerup.cost}
                >
                  Buy ({powerup.cost} pts)
                </button>
              </div>
            ))}
          </div>
        </div>

      </main>
      <footer>
        <p>Copyrights © 2026 Clicker Game by Match IT</p>
      </footer>
    </div>
  );
}

export default ClickerGame;