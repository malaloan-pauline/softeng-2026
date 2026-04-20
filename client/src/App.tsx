import TicTacToe from "./games/tictactoe/tictactoe";
import "./App.css";   
import { useState } from "react";



export default function App() {

  // screen state: here I control which screen is visible
  // "menu" = game selection screen
  // "tictactoe" = the actual game
  const [screen, setScreen] = useState("menu");


  return (
    <div>

       {/* If I'm on the menu screen, show the game selection */}
      {screen === "menu" && (
        <div className="menu-container">
          <h1 className="menu-title">Choose a Game</h1>

          {/* Button to start TicTacToe */}
          <button onClick={() => setScreen("tictactoe")}>
            Play TicTacToe
          </button>
        </div>
      )}

      {/* If I'm on the TicTacToe screen, show the game */}
      {screen === "tictactoe" && (
        // I pass a function to TicTacToe so it can go back to the menu
        <TicTacToe onBack={() => setScreen("menu")} />
      )}


    </div>
  );
}

