// ----<data>----

// words lists
const words = {
    easy: [
        { word: "MOUSE", def: "A pointing device used to interact with a graphical interface." },
        { word: "SERVER", def: "A computer that provides data or services to other computers over a network." },
        { word: "NETWORK", def: "A group of interconnected computers that can share resources." },
        { word: "BROWSER", def: "A software application used to access and navigate the web." },
        { word: "KEYBOARD", def: "An input device used to type characters and commands." },
        { word: "PYTHON", def: "A popular high-level programming language known for its readability." },
        { word: "INTERNET", def: "A global system of interconnected computer networks." },
        { word: "DATABASE", def: "An organized collection of structured data stored electronically." },
        { word: "FUNCTION", def: "A reusable block of code designed to perform a specific task." },
        { word: "VARIABLE", def: "A named storage location that holds a value in a program." },
        { word: "TERMINAL", def: "A text-based interface used to interact with an operating system." },
        { word: "FIREWALL", def: "A security system that monitors and controls incoming and outgoing network traffic." },
        { word: "DOWNLOAD", def: "The process of transferring data from a remote server to a local device." },
        { word: "SOFTWARE", def: "Programs and operating information used by a computer." },
        { word: "HARDWARE", def: "The physical components that make up a computer system." },
        { word: "PROTOCOL", def: "A set of rules that governs how data is transmitted between devices." },
        { word: "STORAGE", def: "The capacity to retain digital data on a device or system." }
    ],
    medium: [
        { word: "ALGORITHM", def: "A step-by-step procedure for solving a problem or accomplishing a task." },
        { word: "COMPILER", def: "A program that translates source code into machine-readable binary." },
        { word: "RECURSION", def: "A technique where a function calls itself to solve a smaller instance of a problem." },
        { word: "FRAMEWORK", def: "A pre-built structure providing tools and conventions for building applications." },
        { word: "DEBUGGER", def: "A tool that helps developers find and fix errors in their code." },
        { word: "MIDDLEWARE", def: "Software that connects different applications or services together." },
        { word: "REPOSITORY", def: "A storage location for managing and tracking changes in source code." },
        { word: "INTERFACE", def: "A shared boundary that defines how two systems communicate with each other." },
        { word: "ENCRYPTION", def: "The process of encoding information so only authorized parties can read it." },
        { word: "INHERITANCE", def: "An OOP concept where a class derives properties and methods from another class." },
        { word: "ITERATION", def: "The repetition of a process, typically using a loop in programming." },
        { word: "DEPLOYMENT", def: "The process of making a software application available for use in production." },
        { word: "EXCEPTION", def: "An event that disrupts the normal flow of a program's execution." },
        { word: "BANDWIDTH", def: "The maximum rate at which data can be transferred over a network connection." },
        { word: "CONTAINER", def: "A lightweight, portable unit that packages code and its dependencies together." },
        { word: "ENDPOINT", def: "A specific URL where an API can be accessed to retrieve or send data." }
    ],
    hard: [
        { word: "POLYMORPHISM", def: "The ability of different objects to respond to the same interface in different ways." },
        { word: "CONCURRENCY", def: "The ability of a system to handle multiple tasks overlapping in time." },
        { word: "ABSTRACTION", def: "The process of hiding complex implementation details behind a simplified interface." },
        { word: "REFACTORING", def: "Restructuring existing code without changing its external behavior to improve readability." },
        { word: "DEPENDENCY", def: "An external module or library required for a piece of software to function." },
        { word: "AUTHENTICATION", def: "The process of verifying the identity of a user or system." },
        { word: "SERIALIZATION", def: "Converting an object into a format that can be stored or transmitted, then reconstructed." },
        { word: "MICROSERVICE", def: "An architectural style where an app is built as a collection of small, independent services." },
        { word: "HEURISTIC", def: "A problem-solving approach that finds a good enough solution when an optimal one is impractical." },
        { word: "IDEMPOTENT", def: "A property where an operation produces the same result regardless of how many times it is applied." },
        { word: "LATENCY", def: "The delay between a request being made and the response being received." },
        { word: "MEMOIZATION", def: "An optimization technique that caches the results of expensive function calls." },
        { word: "OBFUSCATION", def: "The act of making source code difficult to understand to protect intellectual property." },
        { word: "SANDBOXING", def: "Isolating a program in a restricted environment to prevent it from affecting the broader system." },
        { word: "CHECKSUM", def: "A value computed from data to detect errors during transmission or storage." },
        { word: "TOKENIZATION", def: "The process of replacing sensitive data with non-sensitive placeholder values." },
        { word: "ASYNCHRONOUS", def: "A mode of operation where tasks run independently without blocking other processes." }
    ]
};
// game constants
const MAX_ATTEMPTS = 6;
const SCORE_MULTIPLIERS = {
    easy: 1,
    medium: 2,
    hard: 3
};
const FREE_SKIPS = 2;
const SKIP_BASE_COST = 2;

// ----</data>----

// ----<DOM references>----

const screenIntro = document.querySelector("#screen-intro");
const screenGame = document.querySelector("#screen-game");
const screenEnd = document.querySelector("#screen-end");

const btnEasy = document.querySelector(".easy");
const btnMedium = document.querySelector(".medium");
const btnHard = document.querySelector(".hard");
const btnBack = document.querySelector(".back-to-home");

const btnRules = document.querySelector(".button-rules");
const btnExit = document.querySelector(".button-exit");

const hangmanImage = document.querySelector(".hangman-img");
const attemptsDisplay = document.querySelector(".attempts b");
const scoreDisplay = document.querySelector(".score b");
const hintDisplay = document.querySelector(".hint b");
const wordDisplay = document.querySelector(".word-display");
const keyboardDiv = document.querySelector(".keyboard");
const btnSkip = document.querySelector(".skip");

const endTitle = document.querySelector("#end-title");
const endWord = document.querySelector("#end-word");
const endScore = document.querySelector("#end-score");
const btnPlayAgain = document.querySelector(".play-again");
const btnNextLevel = document.querySelector(".next-level");
const btnTryAgain = document.querySelector(".try-again");
const btnExitEnd = document.querySelector(".exit");

const rulesModal = document.querySelector("#rules-modal");
const btnCloseModal = document.querySelector(".close-modal");

// ----</DOM references>----

// ----<game state>----

let currentWord = "";
let currentHint = "";
let guessedLetters = [];
let errors = 0;
let score = 0;
let skipUsed = 0;
let currentDifficulty = "";
let usedWord = [];
let skipCost = 0;

// ----</game state>----

// ----<functions>----

function pickWord() {
    const wordList = words[currentDifficulty];
    const randomItem = wordList[Math.floor(Math.random() * wordList.length)]
    currentWord = randomItem.word;
    currentHint = randomItem.def;
}

function updateDisplay() {

    const splitWord = currentWord.split("");
    const letters = splitWord.map(letter => {
        if(guessedLetters.includes(letter)){
            return `<li class="letter correct">${letter}</li>`;
        } else {
            return `<li class="letter"></li>`;
        }
    })
    wordDisplay.innerHTML = letters.join("");
    hintDisplay.textContent = currentHint;

}

function generateKeyboard() {

    keyboardDiv.innerHTML = "";
    for (let i = 65; i <= 90; i++){
        const button = document.createElement("button");
        button.textContent = String.fromCharCode(i);
        button.dataset.letter = String.fromCharCode(i);
        keyboardDiv.appendChild(button);
    }
}

function startGame(difficulty) {

    currentDifficulty = difficulty;
    hangmanImage.src = "images/0.png"
    currentWord = "";
    guessedLetters = [];
    errors = 0;
    score = 0;
    skipUsed = 0;
    usedWord = [];
    skipCost = 0;

    pickWord();
    updateDisplay();
    generateKeyboard();
}

function checkWin() {
    if(currentWord.split("").every(letter => guessedLetters.includes(letter))){
        endGame("win");
    }
}

function checkLoss() {
    if(errors === 6) {
        endGame("loss");
    }
}

function handleGuess(letter) {

    guessedLetters.push(letter);
    const button = keyboardDiv.querySelector(`button[data-letter="${letter}"]`);
    button.disabled = true;

    if(currentWord.includes(letter)) {
        updateDisplay();
        checkWin();
    } else {
        errors ++;
        hangmanImage.src = `images/${errors}.png`;
        checkLoss();
    }
}

// ----</functions>----

// ----</event listeners>----

// ----</event listeners>----

