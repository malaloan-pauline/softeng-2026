import { useState } from "react";
// imported useState because in React we don't manually change the DOM anymore,
// we store the game state here and React updates the UI for us

export default function TicTacToe() {

  // grid: here I store the 9 cells of the board (empty at the start)
  // previously I used querySelectorAll(".gameCell"), now React handles it
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));

    
 // Players: same logic as before but now stored in React state
  const playerI: "I" = "I";   // stays constant
  const AI: "T" = "T";        // stays constant

  // turn: true means it's I's turn, false means it's T's turn
  const [turnI, setTurnI] = useState(true);

  // current player: I or T (starts with I)
  const [currentPlayer, setCurrentPlayer] = useState<"I" | "T">(playerI);

  // gameOver: same as before but now React state
  const [gameOver, setGameOver] = useState(false);

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
    const updatedBoard = [...board];
    updatedBoard[index] = playerI; // same as box.innerText = "I"
    setBoard(updatedBoard);


    // switch turn to AI
    setTurnI(false);
    setCurrentPlayer(AI);
    setMessage("AI's turn");

    // check if human wins or tie
    const result = checkWin(updatedBoard);

    if (result) {
      setGameOver(true);

      if (result === "tie") {
        setMessage("It's a tie!");
      } else {
        setMessage("Player I won!");
      }

      return; // stop here, bot should not play
    }
  }


    // BOT: here I convert my old botAction() into React logic
  // same idea as before: bot chooses a random empty cell and plays "T"
  function botAction() {

    // if the game is already over, bot should not play
    if (gameOver) return;

    // here I get the list of empty cells (React version of getEmptyCells)
    const emptyCells: number[] = [];
    board.forEach((cell, index) => {
      if (cell === "") emptyCells.push(index);
    });

    // if no empty cells exist, bot cannot play
    if (emptyCells.length === 0) return;

    // choose a random index from the list of empty cells
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const chosenCellIndex = emptyCells[randomIndex]!; // same logic as before

    // bot plays
    const updatedBoard = [...board];
    updatedBoard[chosenCellIndex] = AI; // same as chosenBox.innerText = "T"
    setBoard(updatedBoard);

    // check if bot wins or tie
    const result = checkWin(updatedBoard);

    if (result) {
      setGameOver(true);

      if (result === "tie") {
        setMessage("It's a tie!");
      } else {
        setMessage("AI won!");
      }

      return; // stop here, human should not play
    }

    // switch turn back to human
    setTurnI(true);
    setCurrentPlayer(playerI);
    setMessage("Player I's turn");
  }



  return (
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
  );
}
