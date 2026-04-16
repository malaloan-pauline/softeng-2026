import { useState } from "react";
// imported useState because in React we don't manually change the DOM anymore,
// we store the game state here and React updates the UI for us

export default function TicTacToe() {

  // grid: here I store the 9 cells of the board (empty at the start)
  // previously I used querySelectorAll(".gameCell"), now React handles it
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));

  return (
    <div className="tictactoe-board">
      {board.map((cell, index) => (
        <div
          key={index}
          className="cell"
        >
          {cell}
        </div>
      ))}
    </div>
  );
}
