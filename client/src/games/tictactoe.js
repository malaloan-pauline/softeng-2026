// Players: parameters related to players  
    let turnI= true; // the game always start with the player I 
    const playerI ="I" ; // create varables containing the letter for inside the cells (const as these variables will never changed)
    const AI ="T" ;
    let currentPlayer = playerI ; /// it will change at each turn so use let



// Others: Other parameters will be here ( unless a category is created for them later)
 let gameOver = false; // will be used in endgame and restart dame function


 const restartGameButton = document.getElementById("restartGameButton"); // get the restart button by its id 
    restartGameButton.addEventListener('click', restartGame); // add an event listener to the restart button, when it's clicked it will call the function restartGame

 const gameMessage = document.getElementById("gameMessage"); // used const as it always points to the same thing
    gameMessage.innerText = "Player " + currentPlayer + "'s turn"; // set the initial message to indicate that player I starts and will be modified depending on the state of the game


// here i'll code an empty cell function so later the Bot will know where it can play 
 function getEmptyCells() {
    let emptyCells = [];

    boxes.forEach((box, index) => { // for each of the 9 boxes, get its index
        if (box.innerText === "") { // if the box is empty
            emptyCells.push(index); // add its index to the list of empty cells
        }
    });

    return emptyCells; // return the list of empty cells
}




// Grid: parameters and winning conditions for our 3x3 grid
 const boxes = document.querySelectorAll(".gameCell"); // make a list of all our 9 elements with the class "gameCell"

 // Winning cobinations
        const winningCombinations = [
                //horizontal: from top to down
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                // vertical : from left to right
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                //diagonal: from top left to down right 
                [0, 4, 8],
                //diagonal: from top right to down left
                [2, 4, 6]

        ]



    
// BOT: the AI playing against the the player will be coded here
function botAction() {
    const emptyCells = getEmptyCells(); // get the list of empty cells
    
    if (emptyCells.length === 0) return; // exit function if no empty cells

    // choose a random index from the list of empty cells
    const randomIndex = Math.floor(Math.random() * emptyCells.length); // .floor round doun to the nearest integer and.random gives a random number between 0 and 1

    // get the index of the chosen cell from the list of empty cells
    const chosenCellIndex = emptyCells[randomIndex]; 
    // get the Actual box element (from list of all indexes) using the index 
    const chosenBox = boxes[chosenCellIndex]; 

    // bot plays
    chosenBox.innerText = "T";
    chosenBox.style.pointerEvents = "none";// BOT PLAYS DIRECTLY
   
    checkWin();

     if (gameOver) return; // bot stop id game ends

    // switch turn back to human
    turnI = true;
    currentPlayer = playerI;
    gameMessage.innerText = "Player " + currentPlayer + "'s turn";

    }

// Here will be all the fuctions
    // here for before the game starts 


    // here for during the game 

        boxes.forEach((box) => { // this function will be applied to each of the 9 "boxes"
            box.addEventListener('click', function ()  {
                // prevents clicking again on the same cell/box
                if (box.innerText !== "") return;

                 // prevents clicking during bots turn
                 if (!turnI) return;

                  // human plays
                   box.innerText = playerI; // make I appear in the box
                   turnI = false; 
                   box.style.pointerEvents = "none"; // disable THIS box
                   currentPlayer = AI;  // update the current player to AI
                   
                     checkWin(); 

                  if (!turnI) {
                  gameMessage.innerText = `Player ${currentPlayer}'s turn`; 
                  const delay = Math.floor(Math.random() * 1000) + 500; // random delay, at least half a second and at most 1.5 seconds
                  setTimeout(botAction, delay);
                } 
                    
             });
         });



        // Check win or draw

            // Here to check win

                function checkWin() {
                    for (let combination of winningCombinations) { // for each of the 8 winning combinations
                        const [a, b, c] = combination; // get the 3 cells of that combination  
                         
                        const cellA = boxes[a].innerText; // get the value of the first cell
                        const cellB = boxes[b].innerText; // get the value of the second cell
                        const cellC = boxes[c].innerText; // get the value of the third cell

                        if (cellA !== "" && cellA === cellB && cellA === cellC) { // if all 3 cells are not empty and have the same value
                           endGame(cellA); // call the endGame function with the winner (cellA) as an argument
                           return; // exit the function
                        }
                    }
                      checkTie(); // if no win found, check for tie
                }

            // Here to tie/draw?

                function checkTie( ) {
                     for (let box of boxes) {
                        if (box.innerText === "") {
                                 return; 
                        }
                     }

                 // if we reach here, no empty cells exist
                    endGame("tie"); // call endGame with "tie" as an argument
                }



     // here for ending the game
        

    function endGame(result) { // put a result parameter
         gameOver = true;

            // disable all boxes
            boxes.forEach(box => {
                box.style.pointerEvents = "none"; // disable all boxes
            });

            // show final message
            if (result === "tie") {
                 gameMessage.innerText = "It's a tie!";
            } else {
                 gameMessage.innerText = "Player " + result + " Won!";
           }
    }
    


     // Here for the restart button (works everytime, before, during and after the game)


         function restartGame() {
           gameOver = false;

            turnI = true; // I starts again
            currentPlayer = playerI;  
            gameMessage.innerText = "Player " + currentPlayer + "'s turn";

            boxes.forEach(box => { // applied to each of the 9 cells
            box.innerText = "";          // clear the cell
            box.style.pointerEvents = "auto"; // make it clickable again
            });

        } 



// Message: here will be all the messages, i'll probably use a for loop to check each state of the game and print a message accordingly

