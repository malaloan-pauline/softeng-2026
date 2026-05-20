import { useState, useRef  } from "react";
import { useNavigate } from "react-router-dom";
import "./tictactoe.css";
import BackgroundHalos from '../../components/BackgroundHalos/BackgroundHalos';
import { submitScore } from '../../user-system/submitScore';

type ConfettiParticle = {
  id: number; x: number; color: string;
  size: number; duration: number; delay: number;
};

const CONFETTI_COLORS = [
  "#e8a0a8", "#d4707c", "#e8e4d4",
  "#c57269", "#9dcba2", "#6b9c70",
  "#b9ddc1", "#f5d0d4", "#2d5a35", "#A7C957",
];

const winningCombinations: [number, number, number][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];


export default function TicTacToe() {
  const navigate = useNavigate();

  const [scoreI,  setScoreI]  = useState(() => parseInt(localStorage.getItem("scoreI")  || "0"));
  const [scoreAI, setScoreAI] = useState(() => parseInt(localStorage.getItem("scoreAI") || "0"));
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const playerI: "I" = "I";
  const AI:      "T" = "T";
  const [turnI, setTurnI] = useState(true);
  const [message, setMessage] = useState("It is your turn!");
  const [showPopup, setShowPopup] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [confetti, setConfetti]   = useState<ConfettiParticle[]>([]);
  const confettiFired = useRef(false);
  const [lastRoundPoints, setLastRoundPoints] = useState(0);


  function updateScore(player: "I" | "T", points: number) {
    if (player === "I") {
      const newScore = scoreI + points;
      setScoreI(newScore);
      localStorage.setItem("scoreI", newScore.toString());
    } else {
      const newScore = scoreAI + points;
      setScoreAI(newScore);
      localStorage.setItem("scoreAI", newScore.toString());
    }
  }

  function spawnConfetti() {
    if (confettiFired.current) return;
    confettiFired.current = true;
    setConfetti(
      Array.from({ length: 70 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 6 + Math.random() * 8,
        duration: 2.2 + Math.random() * 2,
        delay: Math.random() * 0.8,
      }))
    );
    setTimeout(() => setConfetti([]), 5000);
  }

  function checkWin(boardToCheck: string[]): "I" | "T" | "tie" | null {
    for (let [a, b, c] of winningCombinations) {
      const cellA = boardToCheck[a];
      const cellB = boardToCheck[b];
      const cellC = boardToCheck[c];
      if (cellA !== "" && cellA === cellB && cellA === cellC) {
        return cellA as "I" | "T";
      }
    }
    const noEmptyCells = boardToCheck.every(cell => cell !== "");
    if (noEmptyCells) return "tie";
    return null;
  }

  function handleCellClick(index: number) {
    if (board[index] !== "") return;
    if (!turnI) return;

    const newBoard = [...board];
    newBoard[index] = playerI;
    setBoard(newBoard);

    const result = checkWin(newBoard);
    if (result) {
      if (result === "I") {
        setMessage("You won!");
        setLastRoundPoints(2);
        updateScore("I", 2);
        setShowPopup(true);
        spawnConfetti();
        submitScore({ game: 'tictactoe', metric: 1, points: 2 });
      } else if (result === "tie") {
        setLastRoundPoints(1);
        updateScore("I", 1);
        updateScore("T", 1);
        setMessage("It's a tie!");
        setShowPopup(true);
        submitScore({ game: 'tictactoe', metric: 0, points: 1 });
      }
      return;
    }

    setTurnI(false);
    setMessage("It is AI's turn");
    const delay = Math.floor(Math.random() * 1000) + 500;
    setTimeout(() => botAction(newBoard), delay);
  }

  function botAction(currentBoard: string[]) {
    if (checkWin(currentBoard)) return;

    for (let [a, b, c] of winningCombinations) {
      const line = [currentBoard[a], currentBoard[b], currentBoard[c]];
      if (line.filter(v => v === AI).length === 2 && line.includes("")) {
        const emptyIndex = [a, b, c][line.indexOf("")];
        const updatedBoard = [...currentBoard];
        updatedBoard[emptyIndex] = AI;
        setBoard(updatedBoard);

        const result = checkWin(updatedBoard);
        if (result) {
          if (result === "T") {
            updateScore("T", 2);
            setLastRoundPoints(0);
            setMessage("AI won!");
            setShowPopup(true);
            submitScore({ game: 'tictactoe', metric: 0, points: 0 });
          } else if (result === "I") {
            setLastRoundPoints(2);
            updateScore("I", 2);
            setMessage("You won!");
          } else if (result === "tie") {
            setLastRoundPoints(1);
            updateScore("I", 1);
            updateScore("T", 1);
            setMessage("It's a tie!");
            setShowPopup(true);
            submitScore({ game: 'tictactoe', metric: 0, points: 1 });
          }
          return;
        }

        setTurnI(true);
        setMessage("It is your turn!");
        return;
      }
    }

    const emptyCells: number[] = [];
    currentBoard.forEach((cell, index) => {
      if (cell === "") emptyCells.push(index);
    });
    if (emptyCells.length === 0) return;

    const randomIndex     = Math.floor(Math.random() * emptyCells.length);
    const chosenCellIndex = emptyCells[randomIndex]!;
    const updatedBoard = [...currentBoard];
    updatedBoard[chosenCellIndex] = AI;
    setBoard(updatedBoard);

    const result = checkWin(updatedBoard);
    if (result) {
      if (result === "T") {
        updateScore("T", 2);
        setLastRoundPoints(0);
        setMessage("AI won!");
        setShowPopup(true);
        submitScore({ game: 'tictactoe', metric: 0, points: 0 });
      } else if (result === "I") {
        setLastRoundPoints(2);
        updateScore("I", 2);
        setMessage("You won!");
      } else if (result === "tie") {
        setLastRoundPoints(1);
        updateScore("I", 1);
        updateScore("T", 1);
        setMessage("It's a tie!");
        setShowPopup(true);
        submitScore({ game: 'tictactoe', metric: 0, points: 1 });
      }
      return;
    }

    setTurnI(true);
    setMessage("It is your turn!");
  }

  function restartGame() {
    setBoard(Array(9).fill(""));
    setTurnI(true);
    setMessage("It is your turn!");
    setShowPopup(false);
    setConfetti([]);
    confettiFired.current = false;
    setLastRoundPoints(0);
  }

  function resetPoints() {
    setScoreI(0);
    setScoreAI(0);
    localStorage.setItem("scoreI", "0");
    localStorage.setItem("scoreAI", "0");
    setShowResetConfirm(false);
  }


  return (
    <div id="ttt-container" style={{ fontFamily: 'var(--font-body)' }}>
      <BackgroundHalos />

      {/* top nav bar */}
      <nav className="ttt-navbar">
        <button
          onClick={() => navigate("/games")}
          className="ttt-btn ttt-btn--back"
          aria-label="Back to game selection"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
          </svg>
          Games
        </button>

        <div className="ttt-navbar__actions">
          <button onClick={() => setShowRules(true)} className="ttt-btn" style={{ fontFamily: 'var(--font-display)' }}>Rules</button>
          <button onClick={restartGame}              className="ttt-btn ttt-btn--danger" style={{ fontFamily: 'var(--font-display)' }}>Restart</button>
        </div>
      </nav>

      <main className="ttt-main">
        <h1 className="ttt-title">Tict'IT</h1>

        {/* scoreboard */}
        <div className="ttt-score">
          <span>You : <strong>{scoreI}</strong></span>
          <span>AI  : <strong>{scoreAI}</strong></span>
        </div>

        {/* reset points — only when player has points */}
        {scoreI > 0 && (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-xs text-[var(--c-text)] opacity-60 underline underline-offset-2 hover:opacity-100 transition-opacity"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Reset points
          </button>
        )}

        {/* status message */}
        <p className="ttt-message">{message}</p>

        {/* game board */}
        <div className="ttt-panel">
          <div className="ttt-board">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={cell !== "" || !turnI}
                className={[
                  "ttt-cell",
                  cell === "I" ? "ttt-cell--player" : "",
                  cell === "T" ? "ttt-cell--ai"     : "",
                ].join(" ")}
              >
                {cell}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* confetti pieces */}
      {confetti.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left:              `${p.x}vw`,
            width:             p.size,
            height:            p.size,
            background:        p.color,
            animationDuration: `${p.duration}s`,
            animationDelay:    `${p.delay}s`,
          }}
        />
      ))}

      {/* Win / Lose / Draw — top banner, board stays visible */}
      {showPopup && (
        <div className="ttt-popup" role="dialog" aria-modal="true">
          <h2 className="ttt-popup__title">{message}</h2>
          {lastRoundPoints > 0 && (
            <p className="ttt-popup__points">+{lastRoundPoints} pt{lastRoundPoints !== 1 ? "s" : ""} this round</p>
          )}
          <p className="ttt-popup__score">Your total: <strong>{scoreI} pts</strong></p>
          <div className="ttt-popup__actions">
            <button
              onClick={() => { setShowPopup(false); restartGame(); }}
              className="ttt-modal__btn"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Play Again
            </button>
            <button
              onClick={() => navigate("/games")}
              className="ttt-modal__btn ttt-modal__btn--outline"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Back to Games
            </button>
          </div>
        </div>
      )}

      {/* Rules modal — centered overlay */}
      {showRules && (
        <div className="ttt-overlay" onClick={() => setShowRules(false)}>
          <div className="ttt-dialog" onClick={e => e.stopPropagation()}>
            <button
              className="ttt-dialog__close"
              onClick={() => setShowRules(false)}
              aria-label="Close rules"
              style={{ fontFamily: 'var(--font-display)' }}
            >✕</button>
            <h2 className="ttt-dialog__title">How to Play</h2>
            <ul className="ttt-dialog__list">
              <li>You play as <strong>I</strong>, the AI plays as <strong>T</strong>.</li>
              <li>Align 3 symbols in a row: horizontally, vertically, or diagonally.</li>
              <li>Players alternate turns — you always go first.</li>
              <li>Win: <strong>+2 pts</strong></li>
              <li>Draw: <strong>+1 pt</strong> each</li>
              <li>Loss: <strong>0 pts</strong></li>
            </ul>
            <button
              onClick={() => setShowRules(false)}
              className="ttt-modal__btn ttt-dialog__confirm"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Reset points confirmation */}
      {showResetConfirm && (
        <div className="ttt-overlay" onClick={() => setShowResetConfirm(false)}>
          <div className="ttt-dialog" onClick={e => e.stopPropagation()}>
            <h2 className="ttt-dialog__title">Reset points</h2>
            <p className="ttt-dialog__text">
              You currently have <strong>{scoreI} pts</strong>. Reset your score to zero?
            </p>
            <div className="ttt-dialog__actions">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="ttt-modal__btn ttt-modal__btn--outline"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Cancel
              </button>
              <button
                onClick={resetPoints}
                className="ttt-modal__btn ttt-modal__btn--accent"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="ttt-footer">
        <p>Copyright © 2026 Tict'IT Game by MatchIT</p>
      </footer>
    </div>
  );
}