import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Word item interface: represents a word and its definition
interface WordItem {
  word: string;
  def: string;
}

// Difficulty type
type Difficulty = "easy" | "medium" | "hard" | "";

// --------------------
// Constants (unchanged logic)
// --------------------
const words: Record<"easy" | "medium" | "hard", WordItem[]> = {
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

const MAX_ATTEMPTS = 6;
const SCORE_MULTIPLIERS: Record<"easy" | "medium" | "hard", number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};
const FREE_SKIPS = 2;
const SKIP_BASE_COST = 2;

// --------------------
// Hangman component
// --------------------

export default function Hangman(): React.JSX.Element {
  // --------------------
  // Component state (mirrors original game state)
  // --------------------
  const [currentWord, setCurrentWord] = useState<string>("");
  const [currentHint, setCurrentHint] = useState<string>("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [errors, setErrors] = useState<number>(0);
  const [score, setScore] = useState<number>(0); // session score
  const [skipsUsed, setSkipsUsed] = useState<number>(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>("");
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [skipCost, setSkipCost] = useState<number>(SKIP_BASE_COST);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [skipExplained, setSkipExplained] = useState<boolean>(false);
  const [endResult, setEndResult] = useState<"win" | "loss" | null>(null);

  // UI state
  const [activeScreen, setActiveScreen] = useState<"screen-intro" | "screen-game" | "screen-end">("screen-intro");
  const [rulesModalVisible, setRulesModalVisible] = useState<boolean>(false);
  const [skipModalVisible, setSkipModalVisible] = useState<boolean>(false);

  // Refs to keep stable values for event handlers when necessary
  const gameActiveRef = useRef(gameActive);
  useEffect(() => {
    gameActiveRef.current = gameActive;
  }, [gameActive]);

  // --------------------
  // Utility: alphabet array for keyboard
  // --------------------
  const alphabet = useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  }, []);

  // --------------------
  // pickWord: choose a new word for the current difficulty, avoiding repeats in session
  // --------------------
  const pickWord = useCallback((difficulty: "easy" | "medium" | "hard") => {
    const list = words[difficulty];
    const available = list.filter((item) => !usedWords.includes(item.word));
    let pool = available.slice();
    if (pool.length === 0) {
      // reset usedWords and use full list
      setUsedWords([]);
      pool = list.slice();
    }
    const randomItem = pool[Math.floor(Math.random() * pool.length)];
    setCurrentWord(randomItem.word);
    setCurrentHint(randomItem.def);
    setUsedWords((prev) => [...prev, randomItem.word]);
  }, [usedWords]);

  // --------------------
  // updateDisplay equivalents are handled by React rendering.
  // --------------------

  // --------------------
  // startGame: initialize states for a new round
  // --------------------
  const startGame = useCallback(
    (difficulty: Difficulty) => {
      if (!difficulty) return;
      setCurrentDifficulty(difficulty);
      setErrors(0);
      setGuessedLetters([]);
      setEndResult(null);
      setGameActive(true);
      setActiveScreen("screen-game");
      pickWord(difficulty);
    },
    [pickWord]
  );

  // --------------------
  // handleGuess: process a guessed letter
  // --------------------
  const handleGuess = useCallback(
    (letter?: string) => {
      if (!letter) return;
      if (!gameActiveRef.current) return;
      if (guessedLetters.includes(letter)) return;
      setGuessedLetters((prev) => [...prev, letter]);
      if (!currentWord.includes(letter)) {
        setErrors((prev) => prev + 1);
      }
    },
    [currentWord, guessedLetters]
  );

  // --------------------
  // performSkipAction: implements free and paid skips logic
  // --------------------
  const performSkipAction = useCallback(() => {
    // free skip
    if (skipsUsed < FREE_SKIPS) {
      setErrors(0);
      setGuessedLetters([]);
      // pick a new word
      pickWord(currentDifficulty as "easy" | "medium" | "hard");
      setSkipsUsed((s) => s + 1);
      return;
    }

    // paid skip
    if (score < skipCost) {
      // not enough points; keep behavior (alert)
      // Consumers may replace alert with custom UI
      // eslint-disable-next-line no-alert
      alert(`Not enough points to skip. Need ${skipCost} pts.`);
      return;
    }

    // deduct cost and perform skip
    setScore((prev) => prev - skipCost);
    setErrors(0);
    setGuessedLetters([]);
    pickWord(currentDifficulty as "easy" | "medium" | "hard");
    setSkipsUsed((s) => s + 1);
    // increase cost for next paid skip
    setSkipCost((c) => c + SKIP_BASE_COST);
  }, [skipsUsed, score, skipCost, currentDifficulty, pickWord]);

  // --------------------
  // skipWord: show explanation modal once, otherwise perform skip
  // --------------------
  const skipWord = useCallback(() => {
    if (!skipExplained) {
      setSkipModalVisible(true);
      return;
    }
    performSkipAction();
  }, [skipExplained, performSkipAction]);

  // --------------------
  // Keyboard click handler (renders buttons directly)
  // --------------------
  const onKeyboardClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON") {
        const letter = target.getAttribute("data-letter") || undefined;
        if (letter) handleGuess(letter);
      }
    },
    [handleGuess]
  );

  // --------------------
  // Keydown listener: handle physical keyboard input while gameActive
  // --------------------
  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if (!gameActiveRef.current) return;
      const letter = ev.key.toUpperCase();
      if (letter >= "A" && letter <= "Z" && letter.length === 1) {
        handleGuess(letter);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleGuess]);

  // --------------------
  // Win detection: runs after guessedLetters state update
  // --------------------
  useEffect(() => {
    if (!gameActive || !currentWord || guessedLetters.length === 0) return;
    if (currentWord.split("").every((l) => guessedLetters.includes(l))) {
      const diff = currentDifficulty as "easy" | "medium" | "hard";
      const points = (MAX_ATTEMPTS - errors) * SCORE_MULTIPLIERS[diff];
      setScore((prev) => prev + points);
      setActiveScreen("screen-end");
      setEndResult("win");
      setGameActive(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guessedLetters]);

  // --------------------
  // Loss detection: runs after errors state update
  // --------------------
  useEffect(() => {
    if (!gameActive) return;
    if (errors === MAX_ATTEMPTS) {
      setActiveScreen("screen-end");
      setEndResult("loss");
      setGameActive(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  // --------------------
  // UI helpers for displays
  // --------------------
  const attemptsLeft = MAX_ATTEMPTS - errors;
  const hangmanImageSrc = `images/${errors}.png`;

  const skipCostText = useMemo(() => {
    if (skipsUsed < FREE_SKIPS) {
      const freeLeft = FREE_SKIPS - skipsUsed;
      return `Free (${freeLeft} left)`;
    }
    return `${skipCost} pts`;
  }, [skipsUsed, skipCost]);

  // --------------------
  // initialize on mount (sets intro screen and hides modals)
  // --------------------
  useEffect(() => {
    setActiveScreen("screen-intro");
    setRulesModalVisible(false);
    setSkipModalVisible(false);
  }, []);

  // --------------------
  // Render component (keeps original HTML structure and classNames)
  // --------------------
  return (
    <div className="hangman-root">
      {/* Rules modal */}
      {rulesModalVisible && (
        <div className="rules-modal" id="rules-modal">
          <div className="modal-content">
            <h2>Rules</h2>
            <p>
              Guess the hidden CS word letter by letter. You have 6 attempts. Each wrong guess draws the hangman closer to his fate. Use the hint wisely!
            </p>
            <button className="close-modal" onClick={() => setRulesModalVisible(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Skip modal (shown once before the first paid skip) */}
      {skipModalVisible && (
        <div className="skip-modal" id="skip-modal">
          <div className="modal-content">
            <h2>Skip info</h2>
            <p>
              First two skips are free. Afterwards each skip costs points and increases by +2 each time.
            </p>
            <div className="modal-actions">
              <button
                className="skip-cancel"
                onClick={() => {
                  setSkipModalVisible(false);
                  setSkipExplained(true);
                }}
              >
                Cancel
              </button>
              <button
                className="skip-confirm"
                onClick={() => {
                  setSkipModalVisible(false);
                  setSkipExplained(true);
                  performSkipAction();
                }}
              >
                Use skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intro screen */}
      <div className="screen-intro" id="screen-intro" style={{ display: activeScreen === "screen-intro" ? "block" : "none" }}>
        <h1>Hangman Game</h1>
        <img className="intro-img" src="images/intro.png" alt="hangman illustration" />
        <h2>Rules</h2>
        <p>
          Guess the hidden CS word letter by letter. You have 6 attempts. Each wrong guess draws the hangman closer to his fate. Use the hint wisely!
        </p>
        <div className="difficulty-buttons">
          <button className="easy" onClick={() => startGame("easy")}>
            Easy
          </button>
          <button className="medium" onClick={() => startGame("medium")}>
            Medium
          </button>
          <button className="hard" onClick={() => startGame("hard")}>
            Hard
          </button>
        </div>
        <button className="back-to-home" onClick={() => setActiveScreen("screen-intro")}>
          Back
        </button>
      </div>

      {/* Game screen */}
      <div className="screen-game" id="screen-game" style={{ display: activeScreen === "screen-game" ? "block" : "none" }}>
        <div className="topnav">
          <h1>Hangman</h1>
          <button className="button-rules" onClick={() => setRulesModalVisible(true)}>
            Rules
          </button>
          <button className="button-exit" onClick={() => setActiveScreen("screen-intro")}>
            Exit
          </button>
        </div>
        <div className="game-left">
          <img className="hangman-img" src={hangmanImageSrc} alt="hangman" />
          <p className="attempts">
            Left attempts: <b>{attemptsLeft}</b>
          </p>
          <p className="score">
            Points: <b>{score}</b>
          </p>
        </div>
        <div className="game-right">
          <div className="keyboard" onClick={onKeyboardClick}>
            {alphabet.map((letter) => {
              const disabled = guessedLetters.includes(letter) || !gameActive;
              return (
                <button key={letter} data-letter={letter} disabled={disabled}>
                  {letter}
                </button>
              );
            })}
          </div>
          <p className="hint">
            Hint: <b>{currentHint}</b>
          </p>
          <ul className="word-display">
            {currentWord.split("").map((ch, idx) => (
              <li key={idx} className={`letter ${guessedLetters.includes(ch) ? "correct" : ""}`}>
                {guessedLetters.includes(ch) ? ch : ""}
              </li>
            ))}
          </ul>
          <button className="skip" onClick={() => skipWord()}>
            Skip (<span className="skip-cost">{skipCostText}</span>)
          </button>
        </div>
      </div>

      {/* End screen */}
      <div className="screen-end" id="screen-end" style={{ display: activeScreen === "screen-end" ? "block" : "none" }}>
        <h1 id="end-title">{endResult === "win" ? "Success!" : "You lost!"}</h1>
        <p id="end-word">{currentWord}</p>
        <p id="end-score">Score: {score} pts</p>
        <button className="play-again" style={{ display: endResult === "win" ? "block" : "none" }} onClick={() => startGame(currentDifficulty)}>
          Play again
        </button>
        <button className="next-level" style={{ display: endResult === "win" ? "block" : "none" }} onClick={() => {
          if (currentDifficulty === "easy") startGame("medium");
          else if (currentDifficulty === "medium") startGame("hard");
        }}>
          Next Level
        </button>
        <button className="try-again" style={{ display: endResult === "loss" ? "block" : "none" }} onClick={() => startGame(currentDifficulty)}>
          Try again
        </button>
        <button className="exit" onClick={() => setActiveScreen("screen-intro")}>
          Exit
        </button>
      </div>
    </div>
  );
}
