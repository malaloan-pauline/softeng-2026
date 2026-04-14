// Players: parameters related to players  
    let turnI= true; // the game always start with the player I 
    const playerI ="I" ; // const as these variables will never changed
    const playerT ="T" ;
    let currentPlayer = playerI ; /// it will change at each turn so use let

// Others: Other parameters will be here ( unless a category is created for them later)





// Grid: parameters and winning conditions for our 3x3 grid
 const boxes = document.querySelectorAll(".game-cell"); // make a list of all our 9 elements with the class "game-cell"

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
                    checkWin(); // called after each play
                } else {
                    box.innerText = 'T'; // make T appear in the box
                    turnI = true; 
                    checkWin(); // called after each play
                }
            

                    });



         });



        // Check win or draw

            // Here to check win

                function checkWin() {

                }

            // Here to tie/draw?

                function checkTie( ) {
                
                }



     // here for ending the game
        

     function endGame( ) {
                
            }
    

     

     // here for what happens when the game ends

      function gameEnded( ) {
                
            }


     // Here for the restart button (works everytime, before, during and after the game)

             // Here to check win

            function checkWin( ) {

            }

        // Here to tie/draw?

         function restartGame( ) {
                
            }



// Message: here will be all the messages, i'll probably use a for loop to check each state of the game and print a message accordingly

