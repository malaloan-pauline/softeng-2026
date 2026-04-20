import { useState } from "react";
// imported useState because in React we don't manually change the DOM anymore,
// we store the game state here and React updates the UI for us

interface TicTacToeProps {
  onBack: () => void;
}


export default function TicTacToe({ onBack }: TicTacToeProps) {

  // grid: here I store the 9 cells of the board (empty at the start)
  // previously I used querySelectorAll(".gameCell"), now React handles it
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));

    
 // Players: same logic as before but now stored in React state
  const playerI: "I" = "I";   // stays constant
  const AI: "T" = "T";        // stays constant

  // turn: true means it's I's turn, false means it's T's turn
  const [turnI, setTurnI] = useState(true);

  

  // gameOver: same as before but now React state
  const [gameOver, setGameOver] = useState(false);

  // score tracking
  const [scoreI, setScoreI] = useState(0);
  const [scoreAI, setScoreAI] = useState(0);

  // message: replaces gameMessage.innerText
  const [message, setMessage] = useState("Player I's turn");


  // Winning combinations: same logic as before, just moved into React
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
    [2, 4, 6]
  ];

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


    // switch turn to AI
    setTurnI(false);

    setMessage("AI's turn");

    // check if human wins or tie
    const result = checkWin(newBoard);

    if (result) {
    setGameOver(true);
    if (result === "I") {
      setScoreI(prev => prev + 2); // Player I gets 2 points for winning
      setMessage("Player I won!");
    } else if (result === "tie") {
      setScoreI(prev => prev + 1); // Player I gets 1 point for a tie
      setMessage("It's a tie!");
    }   
    
     return;
    }

        // let the bot play after a small delay (same idea as before)
    const delay = Math.floor(Math.random() * 1000) + 500; // between 0.5s and 1.5s
    setTimeout(() => botAction(newBoard), delay);

  }


    // BOT: here I convert my old botAction() into React logic
  // same idea as before: bot chooses a random empty cell and plays "T"
  function botAction(currentBoard: string[]) {

    // if the game is already over, bot should not play
    if (gameOver) return;

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
        setGameOver(true);

       if (result === "T") {
        setScoreAI(prev => prev + 2); // AI gets 2 points for winning
        setMessage("AI won!");
       } else if (result === "I") {
        setScoreI(prev => prev + 2); // Player I wins during bot turn (rare but possible)
        setMessage("Player I won!");
       } else if (result === "tie") {
        setScoreI(prev => prev + 1); // Player I gets 1 point for a tie
        setScoreAI(prev => prev + 1); // AI gets 1 point for a tie
        setMessage("It's a tie!");
       }
        return; // stop here, game ends
       }

      // if somehow no win, switch turn back to human
      setTurnI(true);
      setMessage("Player I's turn");
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
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const chosenCellIndex = emptyCells[randomIndex]!; // same logic as before

    // bot plays
    const updatedBoard = [...currentBoard];
    updatedBoard[chosenCellIndex] = AI; // same as chosenBox.innerText = "T"
    setBoard(updatedBoard);

    // check if bot wins or tie
    const result = checkWin(updatedBoard);

   
  if (result) {
    setGameOver(true);
    if (result === "I") {
      setScoreI(prev => prev + 1); // add point to Player I
      setMessage("Player I won!");
   } else if (result === "tie") {
    setMessage("It's a tie!");
   }

    return;
  }
    // switch turn back to human
    setTurnI(true);
    
    setMessage("Player I's turn"); 
  }

  // Here I convert my old restartGame() into React logic
  // same idea as before: reset everything so a new game can start
  function restartGame() {

    // reset the board
    setBoard(Array(9).fill(""));

    // reset game state
    setTurnI(true); // I starts again
    setGameOver(false);

    // reset scores
    setScoreI(0);
    setScoreAI(0);

    // reset message
    setMessage("Player I's turn");

  
  }


  return (
    <div className="tictactoe-container">
       <h1 className="tictactoe-title"> Tict'IT Game </h1>

      <div className="scoreboard">
       <span>Player I: {scoreI}</span>
       <span>AI: {scoreAI}</span>
      </div>


       <p>{message}</p>

    <div className="tictactoe-board">
      {board.map((cell, index) => (
        <div
          key={index}
          className="cell"
          onClick={() => handleCellClick(index)} // new click logic
        >
          {cell}
        </div>
      ))}
    </div>

{/* Restart button */}
     <div className="button-row">
      <button onClick={restartGame}>Restart Game</button>
      <button onClick={onBack}>Back to Menu</button>
     </div>
    </div>

  );
}
