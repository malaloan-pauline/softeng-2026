import { useState } from "react";

const UPGRADES = [
  { id: 1, name: "Mechanical Keyboard", cost: 25,  power: 10 },
  { id: 2, name: "Dual Monitors",       cost: 200, power: 50 },
  { id: 3, name: "Brainrot",            cost: 500, power: 67 },
];

const POWERUPS = [
  { id: 1, name: "Iced Latte Matcha",       cost: 15,  cps: 0.5 },
  { id: 2, name: "Ube Matcha Cheesecake",   cost: 100,  cps: 3  },
];

function ClickerGame() {
  const [score,      setScore]      = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [cps,        setCps]        = useState(0);

  function handleClick() {
    setScore(prev => prev + clickPower);
  }

  function buyUpgrade(upg) {
    if (score < upg.cost) return;
    setScore(prev => prev - upg.cost);
    setClickPower(prev => prev + upg.power);
  }

  function buypowerup(powerup) {
    if (score < powerup.cost) return;
    setScore(prev => prev - powerup.cost);
    setCps(prev => prev + powerup.cps);
  }

  return (
    <div id="container">
      <main>

        <div id="clicker">
          <button id="clicker-btn" onClick={handleClick}>Bleh!</button>
        </div>

        <div id="score">
          <p>Score: <span id="score-value">{Math.floor(score)}</span></p>
          <p>Per click: {clickPower}</p>
          <p>Per second: {cps.toFixed(1)}</p>
        </div>

        <div className="upgrades">
          <h3>Upgrades</h3>
          {UPGRADES.map(upg => (
            <div className="upgrade" key={upg.id}>
              <p>{upg.name} — +{upg.power} click power</p>
              <button
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
                onClick={() => buypowerup(powerup)}
                disabled={score < powerup.cost}
              >
                Buy ({powerup.cost} pts)
              </button>
            </div>
          ))}
        </div>

      </main>
      <footer>
        <p>Copyrights © 2026 Clicker Game by Match IT</p>
      </footer>
    </div>
  );
}

export default ClickerGame;