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

    // later we will call checkWin() here
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
