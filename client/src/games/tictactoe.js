// Players: parameters related to players  
    let turnI= true; // the game always start with the player I 
    const playerI ="I" ; // const as these variables will never changed
    const playerT ="T" ;
    let currentPlayer = playerI ; /// it will change at each turn so use let

// Others: Other parameters will be here ( unless a category is created for them later)
 const restartGameButton = document.getElementById("restartGameButton"); // get the restart button by its id 
 restartGameButton.addEventListener('click', restartGame); // add an event listener to the restart button, when it's clicked it will call the function restartGame



// Grid: parameters and winning conditions for our 3x3 grid
 const boxes = document.querySelectorAll(".gameCell"); // make a list of all our 9 elements with the class "gameell"

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



// Here will be all the fuctions
    // here for before the game starts 


    // here for during the game 

        boxes.forEach((box) => { // this function will be applied to each of the 9 "boxes"
            box.addEventListener('click', function ()  {
                    // prevents clicking again on the same cell/box
                if (box.innerText !== "") return;

                if (turnI){
                   box.innerText = 'I'; // make I appear in the box
                   turnI = false; 
                   
                } else {
                    box.innerText = 'T'; // make T appear in the box
                    turnI = true;    
                }
            
                box.style.pointerEvents = "none"; // disable THIS box
                 checkWin(); // called after each play
                    
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
                            endGame(); // end the game
                            return; // exit the function
                        }
                    
                    }

                }

            // Here to tie/draw?

                function checkTie( ) {
                
                }



     // here for ending the game
        

     function endGame() {
            // disable all boxes
            boxes.forEach(box => {
                box.style.pointerEvents = "none"; // disable all boxes
            });
            }
    

     

     // here for what happens when the game ends

      function gameEnded( ) {
                
         $("#message").text("Player " + cellA) + " Won!"; // display the winner message
                $("#message").show()
            }


     // Here for the restart button (works everytime, before, during and after the game)


         function restartGame() {
            turnI = true; // I starts again

            boxes.forEach(box => { // applied to each of the 9 cells
            box.innerText = "";          // clear the cell
            box.style.pointerEvents = "auto"; // make it clickable again
            });

        }



// Message: here will be all the messages, i'll probably use a for loop to check each state of the game and print a message accordingly

