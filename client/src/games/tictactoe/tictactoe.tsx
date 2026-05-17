import { useState, useEffect } from "react";
// imported useState because in React we don't manually change the DOM anymore,
// we store the game state here and React updates the UI for us

import { useNavigate } from "react-router-dom";

import Confetti from "react-confetti";


export default function TicTacToe() {
  const navigate = useNavigate();

  // i also added score tracking, which is stored in local storage to persist across sessions
  const [scoreI, setScoreI] = useState(() => parseInt(localStorage.getItem("scoreI") || "0"));
  const [scoreAI, setScoreAI] = useState(() => parseInt(localStorage.getItem("scoreAI") || "0"));

  // grid: here I store the 9 cells of the board (empty at the start)
  // previously I used querySelectorAll(".gameCell"), now React handles it
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));

    
 // Players: same logic as before but now stored in React state
  const playerI: "I" = "I";   // stays constant
  const AI: "T" = "T";        // stays constant

  // turn: true means it's I's turn, false means it's T's turn
  const [turnI, setTurnI] = useState(true);

  // message: replaces gameMessage.innerText
  const [message, setMessage] = useState("It is your turn!");


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

//for confeti and popup
const [showPopup, setShowPopup] = useState(false);
const [showConfetti, setShowConfetti] = useState(false);
const [showRules, setShowRules] = useState(false); 

// confetti needs a real width/height (avoid 0x0 on first render)
const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

useEffect(() => {
  function update() {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }
  update();
  window.addEventListener("resize", update);
  return () => window.removeEventListener("resize", update);
}, []);

// auto-hide confetti after a short burst
useEffect(() => {
  if (!showConfetti) return;
  const t = setTimeout(() => setShowConfetti(false), 4000); // 4s
  return () => clearTimeout(t);
}, [showConfetti]);


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
      updateScore("I", 2); // I wins  +2 points

      // show popup and confetti
        setShowPopup(true);
        setShowConfetti(true);

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
        updateScore("T", 1);// AI gets 1 point for a tie
        setMessage("It's a tie!");
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
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const chosenCellIndex = emptyCells[randomIndex]!; // same logic as before

    // bot plays
    const updatedBoard = [...currentBoard];
    updatedBoard[chosenCellIndex] = AI; // same as chosenBox.innerText = "T"
    setBoard(updatedBoard);

    // check if bot wins or tie
    const result = checkWin(updatedBoard);

   
  if (result) {
    if (result === "I") {
      updateScore("I", 2); // add point to Player I
      setMessage("You won!");
   } else if (result === "tie") {
      updateScore("I", 1);
      updateScore("T", 1);// AI gets 1 point for a tie
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
    setShowConfetti(false);


  
  }


  return (
    <div className="
        bg-[#F2E8CF]
        min-h-screen
        flex flex-col items-center justify-start
        pt-[5vw]
        relative
        "
        >

          <button
              onClick={() => setShowRules(true)}
              className="
              fixed top-[4vw] right-[2vw]
              w-[5vw] h-[5vw] 
              flex items-center justify-center
              rounded-full
              bg-[#a98467]              
              text-[#1E5C19]
              shadow-md
              hover:bg-[#c79ab0]
              transition
              "
            >
              ?
            </button>


       <h1 className="
        text-[6vw] 
        text-[#6A994E]
          mb-[2vw]
          font-semibold
          text-center
          max-w-[80vw]
          break-words 
          "
          > 
          Tict'IT Game </h1>

      <div className="
          text-[#6A994E]
          flex justify-around
          w-full
          max-w-[80vw]
          mt-[1vw]
          text-[3vw]
          "
          >
       <span>You : {scoreI}</span>
       <span>AI: {scoreAI}</span>
      </div>


       <p className="text-[#6A994E]
          text-[3vw]
          text-center
          mb-[2vw] mt-[5vw]">
            
            {message}</p>

       {showConfetti && (
          <Confetti
           width={windowSize.width || undefined}
           height={windowSize.height || undefined}
           recycle={false}
           numberOfPieces={500}
           colors={['#6A994E', '#A7C957', '#7FBF8E', '#A98467']}
           style={{ position: 'fixed', top: 0, left: 0, zIndex: 998, pointerEvents: 'none' }}
           />
        )}

            {showPopup && (
              <div className="
                fixed inset-0
                w-screen h-screen
                bg-[rgba(0,0,0,0.45)]
                flex items-center justify-center
                z-[999]">


                  <div className="
                  bg-[#a98467]
                  p-8
                  rounded-[12px]
                  text-center
                  shadow-[0_10px_30px_rgba(0,0,0,0.2)]
                  min-w-[260px]">


                    <h2 className="text-[#FFFFFF] font-semibold text-3xl" >{message}</h2>
                    
                    
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={() => {
                            setShowPopup(false);
                            setShowConfetti(false);
                            restartGame();
                          }}
                          className=" 
                              bg-[#7fbf8e]
                              text-[#FFFFFF]
                              px-6 py-3
                              rounded-lg
                              transition
                              hover:bg-[#6aa97a]
                              "
                          >
                          Play Again
                        </button>
                      </div>

                  </div>
              </div>
            )}

            <div className="
              grid
              grid-cols-3 grid-rows-3
              gap-[1vw]
              mt-[3vw] mb-[5vw]
              justify-center"
              >

              {board.map((cell, index) => (
                <div
                  key={index}
               onClick={() => handleCellClick(index)} 

                className="
              w-[20vw] h-[20vw]
              bg-[#A7C957]
              border-[0.3vw] border-[#6A994E]
              flex items-center justify-center
              text-[20vw] text-[#a98467]
              rounded-[0.8vw]
              cursor-pointer
              transition duration-200 ease-in-out
              hover:bg-[#c8d5b9] hover:scale-105
            " >
                  {cell}
                </div>
              ))}
            </div>

          {/* Restart button and back to menu button */}
          <div className="flex gap-6 mt-4">

            <button
              onClick={restartGame}
              className="
                bg-[#a98467]
                text-[#1E5C19]
                px-6 py-3
                rounded-lg
                text-lg
                transition
                hover:bg-[#c79ab0]
              "
            >
              Restart Game
            </button>

            <button
              onClick={() => navigate("/games")}
              className="
                bg-[#a98467]
                text-[#1E5C19]
                px-6 py-3
                rounded-lg
                text-lg
                transition
                hover:bg-[#c79ab0]
              "
            >
              Back to Games
            </button>

          </div>


 
                <p  className="
                   text-[#6a994ed1]
                   text-[2vw]
                   text-center
                   mb-[2vw]
                   mt-[4vw]
                   " 
                 >
          
          Copyright © 2026 Tictactoe Game by MatchIT </p>


          {showRules && (
          <div
            className="
              fixed inset-0 
              bg-black bg-opacity-50 
              flex items-center justify-center 
              z-50
            "
          >
          <div
            className="
              bg-[#F5DEB3]
              rounded-xl 
              p-6 
              w-11/12 max-w-md 
              shadow-lg 
              text-[#1E5C19]
            "
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              How to Play
            </h2>

            <p className="mb-3">
              <strong>Goal:</strong> Align 3 symbols in a row: horizontally, vertically, or diagonally.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Rules</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>You play as <strong>I</strong>.</li>
              <li>The AI plays as <strong>T</strong>.</li>
              <li>Players alternate turns.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">Points</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>Win: <strong>+2 points</strong></li>
              <li>Draw: <strong>+1 point</strong></li>
              <li>Loss: <strong>0 points</strong></li>
            </ul>

            <button
              onClick={() => setShowRules(false)}
              className="
                mt-6 w-full 
                bg-[#a98467] 
                text-[#1E5C19] 
                py-2 rounded-lg 
                hover:bg-[#c79ab0] 
                transition
              "
            >
              Close
            </button>
          </div>


        </div>
      )}
        



    </div>
);
}
