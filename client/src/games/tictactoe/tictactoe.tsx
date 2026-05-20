import { useState, useRef  } from "react";
// imported useState because in React we don't manually change the DOM anymore,
// we store the game state here and React updates the UI for us

import { useNavigate } from "react-router-dom";
import "./tictactoe.css";


// confetti type for when the player wins
type ConfettiParticle = {
  id: number; x: number; color: string;
  size: number; duration: number; delay: number;
};

// confetti colours, kept outside so they don't get recreated every render
const CONFETTI_COLORS = [
  "#e8a0a8", "#d4707c", "#e8e4d4",
  "#c57269", "#9dcba2", "#6b9c70",
  "#b9ddc1", "#f5d0d4", "#2d5a35", "#A7C957",
];

// winning combinations: same logic as before, just moved outside the component
const winningCombinations: [number, number, number][] = [
  // horizontal: from top to down
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // vertical: from left to right
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonal: from top left to down right
  [0, 4, 8],
  // diagonal: from top right to down left
  [2, 4, 6],
];


export default function TicTacToe() {
  const navigate = useNavigate();


  // i also added score tracking, which is stored in local storage to persist across sessions
  const [scoreI,  setScoreI]  = useState(() => parseInt(localStorage.getItem("scoreI")  || "0"));
  const [scoreAI, setScoreAI] = useState(() => parseInt(localStorage.getItem("scoreAI") || "0"));

  // grid: here I store the 9 cells of the board (empty at the start)
  // previously I used querySelectorAll(".gameCell"), now React handles it
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));

  // Players: same logic as before but now stored in React state
  const playerI: "I" = "I";  // stays constant
  const AI:      "T" = "T";  // stays constant

  // turn: true means it's I's turn, false means it's T's turn
  const [turnI, setTurnI] = useState(true);

  // message: replaces gameMessage.innerText
  const [message, setMessage] = useState("It is your turn!");

  // for popup and rules
  const [showPopup, setShowPopup] = useState(false);
  const [showRules, setShowRules] = useState(false);

  // confetti state and ref to prevent multiple confetti spawns
  const [confetti, setConfetti]   = useState<ConfettiParticle[]>([]);
  const confettiFired = useRef(false);


  // Add points and save them permanently
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

  // spawn confetti when player wins
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
    // auto clear after the animation is done
    setTimeout(() => setConfetti([]), 5000);
  }


  // here I convert my old checkWin() into a React-friendly function
  // same logic as before: check each winning combination and return the winner
  function checkWin(boardToCheck: string[]): "I" | "T" | "tie" | null {

    for (let [a, b, c] of winningCombinations) {
      const cellA = boardToCheck[a];
      const cellB = boardToCheck[b];
      const cellC = boardToCheck[c];

      // if all 3 cells are not empty and have the same value -> win
      if (cellA !== "" && cellA === cellB && cellA === cellC) {
        return cellA as "I" | "T";
      }
    }

    // here I check for tie (same idea as before)
    const noEmptyCells = boardToCheck.every(cell => cell !== "");
    if (noEmptyCells) return "tie";

    return null; // no win, no tie
  }


  // here I convert my old click listener into a React function
  function handleCellClick(index: number) {

    // prevents clicking again on the same cell
    if (board[index] !== "") return;

    // prevents clicking during bot's turn
    if (!turnI) return;

    // human plays
    const newBoard = [...board];
    newBoard[index] = playerI;
    setBoard(newBoard);

    // check if human wins or tie
    const result = checkWin(newBoard);

    if (result) {
      if (result === "I") {
        setMessage("You won!");
        updateScore("I", 2); // I wins +2 points

        // show popup and confetti
        setShowPopup(true);
        spawnConfetti();

      } else if (result === "tie") {
        updateScore("I", 1);
        updateScore("T", 1);
        setMessage("It's a tie!");
        setShowPopup(true);
      }
      return;
    }

    // switch turn to AI
    setTurnI(false);
    setMessage("It is AI's turn");

    // let the bot play after a small delay (same idea as before)
    const delay = Math.floor(Math.random() * 1000) + 500; // between 0.5s and 1.5s
    setTimeout(() => botAction(newBoard), delay);
  }


  // BOT: here I convert my old botAction() into React logic
  // same idea as before: bot chooses a random empty cell and plays "T"
  function botAction(currentBoard: string[]) {

    // if the game is already over, bot should not play
    if (checkWin(currentBoard)) return;

    // 1) BOT tries to win (using the same winning combinations as before)
    for (let [a, b, c] of winningCombinations) {

      // here I check the 3 cells of this winning line
      const line = [currentBoard[a], currentBoard[b], currentBoard[c]];

      // if bot has 2 "T" and 1 empty spot -> bot can win right now
      if (line.filter(v => v === AI).length === 2 && line.includes("")) {

        // find the empty cell inside this winning line
        const emptyIndex = [a, b, c][line.indexOf("")];

        // bot plays the winning move
        const updatedBoard = [...currentBoard];
        updatedBoard[emptyIndex] = AI;
        setBoard(updatedBoard);

        // check if bot wins (it should)
        const result = checkWin(updatedBoard);
        if (result) {
          if (result === "T") {
            updateScore("T", 2); // AI gets 2 points for winning
            setMessage("AI won!");
            setShowPopup(true);
          } else if (result === "I") {
            updateScore("I", 2);
            setMessage("You won!");
          } else if (result === "tie") {
            updateScore("I", 1); // Player I gets 1 point for a tie
            updateScore("T", 1); // AI gets 1 point for a tie
            setMessage("It's a tie!");
            setShowPopup(true);
          }
          return; // stop here, game ends
        }

        // if somehow no win, switch turn back to human
        setTurnI(true);
        setMessage("It is your turn!");
        return;
      }
    }

    // 2) If can't win, play randomly
    const emptyCells: number[] = [];
    currentBoard.forEach((cell, index) => {
      if (cell === "") emptyCells.push(index);
    });

    // if no empty cells exist, bot cannot play
    if (emptyCells.length === 0) return;

    // choose a random index from the list of empty cells
    const randomIndex     = Math.floor(Math.random() * emptyCells.length);
    const chosenCellIndex = emptyCells[randomIndex]!; // same logic as before

    // bot plays
    const updatedBoard = [...currentBoard];
    updatedBoard[chosenCellIndex] = AI; // same as chosenBox.innerText = "T"
    setBoard(updatedBoard);

    // check if bot wins or tie
    const result = checkWin(updatedBoard);

    if (result) {
      if (result === "T") {
        updateScore("T", 2);
        setMessage("AI won!");
        setShowPopup(true);
      } else if (result === "I") {
        updateScore("I", 2); // add point to Player I
        setMessage("You won!");
      } else if (result === "tie") {
        updateScore("I", 1);
        updateScore("T", 1); // AI gets 1 point for a tie
        setMessage("It's a tie!");
        setShowPopup(true);
      }
      return;
    }

    // switch turn back to human
    setTurnI(true);
    setMessage("It is your turn!");
  }


  // Here I convert my old restartGame() into React logic
  // same idea as before: reset everything so a new game can start
  function restartGame() {

    // reset the board
    setBoard(Array(9).fill(""));

    // reset game state
    setTurnI(true); // I starts again

    // reset message
    setMessage("It is your turn!");

    // hide popup and confetti if they were showing
    setShowPopup(false);
    setConfetti([]);
    confettiFired.current = false;
  }


  return (
    <div id="ttt-container">

      {/* top nav bar */}
      <nav className="ttt-navbar">

        <button
          onClick={() => navigate("/games")}
          className="ttt-btn ttt-btn--back"
          aria-label="Back to game selection"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
          </svg>
          Games
        </button>

        <div className="ttt-navbar__actions">
          <button onClick={() => setShowRules(true)} className="ttt-btn">Rules</button>
          <button onClick={restartGame}              className="ttt-btn ttt-btn--danger">Restart</button>
        </div>

      </nav>

      <main className="ttt-main">

        <h1 className="ttt-title">Tict'IT Game</h1>

        {/* scoreboard */}
        <div className="ttt-score">
          <span>You : <strong>{scoreI}</strong></span>
          <span>AI  : <strong>{scoreAI}</strong></span>
        </div>

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

      {/* popup at the bottom so the player can still see the board */}
      {showPopup && (
        <div className="ttt-modal-backdrop" onClick={() => { setShowPopup(false); restartGame(); }}>
          <div className="ttt-modal" onClick={e => e.stopPropagation()}>
            <h2>{message}</h2>
            <div className="ttt-modal__actions">
              <button
                onClick={() => { setShowPopup(false); restartGame(); }}
                className="ttt-modal__btn"
              >
                Play Again
              </button>
              <button
                onClick={() => navigate("/games")}
                className="ttt-modal__btn ttt-modal__btn--outline"
              >
                Back to Games
              </button>
            </div>
          </div>
        </div>
      )}

      {/* rules modal, clicking outside closes it */}
      {showRules && (
        <div className="ttt-modal-backdrop" onClick={() => setShowRules(false)}>
          <div className="ttt-rules" onClick={e => e.stopPropagation()}>
            <h2>How to Play</h2>
            <p><strong>Goal:</strong> Align 3 symbols in a row: horizontally, vertically, or diagonally.</p>
            <h3>Rules</h3>
            <ul>
              <li>You play as <strong>I</strong>.</li>
              <li>The AI plays as <strong>T</strong>.</li>
              <li>Players alternate turns.</li>
            </ul>
            <h3>Points</h3>
            <ul>
              <li>Win: <strong>+2 points</strong></li>
              <li>Draw: <strong>+1 point</strong></li>
              <li>Loss: <strong>0 points</strong></li>
            </ul>
            <button onClick={() => setShowRules(false)} className="ttt-rules__close">Close</button>
          </div>
        </div>
      )}

      <footer className="ttt-footer">
        <p>Copyright © 2026 Tict'IT Game by MatchIT</p>
      </footer>

    </div>
  );
}