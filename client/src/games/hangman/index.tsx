import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { API_URL } from '../../config/api';
import { useNavigate } from "react-router-dom";
import './index.css';
import confetti from 'canvas-confetti';
import BackgroundHalos from '../../components/BackgroundHalos/BackgroundHalos';
import { submitScore, syncTotalPoints } from '../../user-system/Score';

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
const PERFECT_BONUS_FACTOR = 2;   // bonus = SCORE_MULTIPLIERS[diff] * PERFECT_BONUS_FACTOR
const LOSS_PENALTY_FACTOR = 2;    // penalty = SCORE_MULTIPLIERS[diff] * LOSS_PENALTY_FACTOR
const GAMES_PATH = "/games";
const ALPHABET = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

// --------------------
// Hangman component
// --------------------

export default function Hangman(): React.JSX.Element {
  const navigate = useNavigate();

  // --------------------
  // Component state (mirrors original game state)
  // --------------------
  const [currentWord, setCurrentWord] = useState<string>("");
  const [currentHint, setCurrentHint] = useState<string>("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [errors, setErrors] = useState<number>(0);
  const [score, setScore] = useState<number>(() => {
    const saved = localStorage.getItem("hangman_score");
    return saved ? parseInt(saved, 10) : 0;
  });
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
  const [noPointsModalVisible, setNoPointsModalVisible] = useState<boolean>(false);
  const [resetModalVisible, setResetModalVisible] = useState<boolean>(false);
  const [lastRoundBonus, setLastRoundBonus] = useState<number>(0);
  const [shaking, setShaking] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = document.documentElement.getAttribute('data-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Persist score to localStorage
  useEffect(() => {
    localStorage.setItem("hangman_score", String(score));
  }, [score]);

  // Refs to keep stable values for event handlers when necessary
  const gameActiveRef = useRef(gameActive);
  useEffect(() => {
    gameActiveRef.current = gameActive;
  }, [gameActive]);

  const guessedLettersRef = useRef(guessedLetters);
  useEffect(() => {
    guessedLettersRef.current = guessedLetters;
  }, [guessedLetters]);

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
      setLastRoundBonus(0);
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
      if (guessedLettersRef.current.includes(letter)) return;
      setGuessedLetters((prev) => [...prev, letter]);
      if (!currentWord.includes(letter)) {
        setErrors((prev) => prev + 1);
      }
    },
    [currentWord]
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
      setNoPointsModalVisible(true);
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
      const bonus = errors === 0 ? SCORE_MULTIPLIERS[diff] * PERFECT_BONUS_FACTOR : 0;
      setScore((prev) => prev + points + bonus);
      setLastRoundBonus(bonus);
      setActiveScreen("screen-end");
      setEndResult("win");
      setGameActive(false);
      submitScore({ game: 'hangman', metric: MAX_ATTEMPTS - errors, points: points + bonus });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guessedLetters]);

  // --------------------
  // Loss detection: runs after errors state update
  // --------------------
  useEffect(() => {
    if (!gameActive) return;
    if (errors === MAX_ATTEMPTS) {
      const diff = currentDifficulty as "easy" | "medium" | "hard";
      const penalty = SCORE_MULTIPLIERS[diff] * LOSS_PENALTY_FACTOR;
      const actualPenalty = Math.min(score, penalty);
      setScore((prev) => Math.max(0, prev - penalty));
      setLastRoundBonus(-actualPenalty);
      setActiveScreen("screen-end");
      setEndResult("loss");
      setGameActive(false);
      submitScore({ game: 'hangman', metric: 0, points: 0 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  // Confetti on win
  useEffect(() => {
    if (endResult === "win") {
      confetti({
        particleCount: 120,
        spread: 80,
        colors: ['#7a9e7e', '#e8e4d4', '#f9dfe0', '#5c7a60', '#ffafcc', '#ffd60a'],
      });
    }

    if (endResult === "loss") {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }, [endResult]);

  // --------------------
  // UI helpers for displays
  // --------------------
  const attemptsLeft = MAX_ATTEMPTS - errors;
  const hangmanImageSrc = `/images/${theme === 'dark' ? 'dark' : 'light'}/${errors}.png`;

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

  // ------<< render component >>-------
  return (
      <div className="hangman-root w-full" style={{ fontFamily: 'var(--font-body)' }}>
      <BackgroundHalos />
      {/* Rules modal */}
      {rulesModalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-[var(--c-surface)] rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl flex flex-col gap-4">
              <h2 className="text-xl font-bold text-[var(--c-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}>
                Rules
              </h2>
              <p className="text-sm text-[var(--c-text)] leading-relaxed">
                Guess the hidden CS word letter by letter. You have 6 attempts.
                Each wrong guess draws the hangman closer to his fate. Use the hint wisely!
              </p>
              <button
                  className="self-end px-5 py-2 rounded-full bg-[var(--c-primary)] text-[var(--c-surface)] font-medium text-sm hover:bg-[var(--c-primary)] transition-colors"
                  onClick={() => setRulesModalVisible(false)}
                  style={{ fontFamily: 'var(--font-display)' }}
              >
                Got it
              </button>
            </div>
          </div>
      )}

      {/* Skip modal */}
      {skipModalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-[var(--c-surface)] rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl flex flex-col gap-4">
              <h2 className="text-xl font-bold text-[var(--c-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}>
                Skip info
              </h2>
              <p className="text-sm text-[var(--c-text)] leading-relaxed">
                First two skips are free. Afterwards each skip costs points and increases by +2 each time.
              </p>
              <div className="flex gap-3 self-end">
                <button
                    className="px-5 py-2 rounded-full border-2 border-[var(--c-primary)] text-[var(--c-text)] font-medium text-sm hover:bg-[var(--c-surface)]/60 transition-colors"
                    onClick={() => {
                      setSkipModalVisible(false);
                      setSkipExplained(true);
                    }}
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                  Cancel
                </button>
                <button
                    className="px-5 py-2 rounded-full bg-[var(--c-primary)] text-[var(--c-surface)] font-medium text-sm hover:bg-[var(--c-primary)] transition-colors"
                    onClick={() => {
                      setSkipModalVisible(false);
                      setSkipExplained(true);
                      performSkipAction();
                    }}
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                  Use skip
                </button>
              </div>
            </div>
          </div>
      )}

      {/* No points modal */}
      {noPointsModalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-[var(--c-surface)] rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl flex flex-col gap-4">
              <h2 className="text-xl font-bold text-[var(--c-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}>
                Not enough points!
              </h2>
              <p className="text-sm text-[var(--c-text)] leading-relaxed">
                You need <span className="font-bold">{skipCost} pts</span> to skip this word, but you have <span className="font-bold">{score} pts</span> at the moment. Keep guessing to earn more points!
              </p>
              <div className="flex self-end">
                <button
                    className="px-5 py-2 rounded-full bg-[var(--c-accent)] text-[var(--c-text)] font-medium text-sm hover:bg-[var(--c-accent)] transition-colors"
                    onClick={() => setNoPointsModalVisible(false)}
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
      )}

      {/* Reset points modal */}
      {resetModalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-[var(--c-surface)] rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl flex flex-col gap-4">
              <h2 className="text-xl font-bold text-[var(--c-text)]">Reset points</h2>
              <p className="text-sm text-[var(--c-text)] leading-relaxed">
                You currently have <span className="font-bold">{score} pts</span>. Do you want to reset your score to zero?
              </p>
              <div className="flex gap-3 self-end">
                <button
                    className="px-5 py-2 rounded-full border-2 border-[var(--c-primary)] text-[var(--c-text)] font-medium text-sm hover:bg-[var(--c-surface)]/60 transition-colors"
                    onClick={() => setResetModalVisible(false)}
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                  Cancel
                </button>
                <button
                    className="px-5 py-2 rounded-full bg-[var(--c-accent)] text-[var(--c-text)] font-medium text-sm hover:bg-[var(--c-accent)] transition-colors"
                    onClick={async () => {
                      const stored = localStorage.getItem('matchit_player');
                      if (stored && score > 0) {
                        try {
                          const { uuid } = JSON.parse(stored);
                          const res = await fetch(`${API_URL}/api/leaderboard/player/${uuid}`);
                          if (res.ok) {
                            const player = await res.json();
                            await syncTotalPoints(Math.max(0, player.totalPoints - score));
                          }
                        } catch {
                          // fail silently
                        }
                      }
                      setScore(0);
                      setResetModalVisible(false);
                    }}
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
      )}

      {/* Intro screen */}
        <div
            id="screen-intro"
            style={{ display: activeScreen === "screen-intro" ? "flex" : "none" }}
            className="flex min-h-screen flex-col items-center justify-center px-4 py-4"
        >
          <div className="intro-columns flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full flex-1">

            {/* Colonne gauche */}
            <div className="intro-col-left flex flex-col items-center gap-3 md:gap-6">
              <h1 className="text-7xl md:text-9xl font-bold text-[var(--c-text)] tracking-tight m-0"
                  style={{fontFamily: "Soopa"}}>
                Hang'IT
              </h1>

              <div className="flex flex-col gap-3 w-72 md:w-100">
                <img
                    src={`/images/${theme === 'dark' ? 'dark' : 'light'}/intro.png`}
                    className="h-52 md:h-80 w-full object-contain block"
                    alt="hangman illustration"
                />
                <div className="bg-[var(--c-surface)]/60 rounded-2xl p-3 md:p-4 text-sm text-[var(--c-text)] leading-relaxed">
                  <h2 className="font-bold text-base mb-2 text-center"
                      style={{ fontFamily: 'var(--font-display)' }}>
                    Rules
                  </h2>
                  <p className="text-xs md:text-sm">
                    Guess the hidden CS word letter by letter. You have 6 attempts.
                    Each wrong guess draws the computer closer to a program crash... Use the hint wisely!
                  </p>
                </div>
              </div>
            </div>

            {/* Colonne droite */}
            <div className="intro-col-right flex flex-col items-center gap-3 w-72 md:w-auto">
      <span className="inline-block text-xs font-medium tracking-[0.12em] uppercase bg-[var(--c-primary)]/10 px-4 py-1 rounded-full text-[var(--c-eyebrow-text)]"
            style={{ fontFamily: 'var(--font-body)' }}>
        Choose difficulty
      </span>
              <button
                  onClick={() => startGame("easy")}
                  style={{ fontFamily: 'var(--font-display)' }}
                  className="w-full py-2 md:py-3 rounded-full bg-[var(--c-primary-lighter)] text-[var(--c-btn-text)] font-bold text-base md:text-lg hover:brightness-95 transition-all"
              >
                Easy
              </button>
              <button
                  onClick={() => startGame("medium")}
                  style={{ fontFamily: 'var(--font-display)' }}
                  className="w-full py-2 md:py-3 rounded-full bg-[var(--c-primary-light)] text-[var(--c-btn-text)] font-bold text-base md:text-lg hover:brightness-95 transition-all"
              >
                Medium
              </button>
              <button
                  onClick={() => startGame("hard")}
                  style={{ fontFamily: 'var(--font-display)' }}
                  className="w-full py-2 md:py-3 rounded-full bg-[var(--c-primary)] text-[var(--c-btn-text)] font-bold text-base md:text-lg hover:brightness-90 transition-all"
              >
                Hard
              </button>
              <div className="flex flex-col items-center gap-1 md:flex-row md:justify-between w-full mt-1 px-1">
        <span className="text-sm text-[var(--c-text)] font-medium">
          Your score: <span className="font-bold">{score} pts</span>
        </span>
                {score > 0 && (
                    <button
                        onClick={() => setResetModalVisible(true)}
                        style={{ fontFamily: 'var(--font-display)' }}
                        className="text-xs text-[var(--c-text)] opacity-60 underline underline-offset-2 hover:opacity-100 transition-opacity"
                    >
                      Reset points
                    </button>
                )}
              </div>
              <button
                  onClick={() => navigate(GAMES_PATH)}
                  style={{ fontFamily: 'var(--font-display)' }}
                  className="text-sm text-[var(--c-text)] underline underline-offset-4 hover:text-[var(--c-primary)] transition-colors"
              >
                ← Back to games page
              </button>
            </div>

          </div>

          <p className="w-full text-xs text-[var(--c-text)] opacity-50 text-center pt-3 pb-4">
            Copyrights © 2026 Hangman Game by Match IT
          </p>
        </div>

      {/* Game screen */}
      <div
          id="screen-game"
          style={{ display: activeScreen === "screen-game" ? "flex" : "none" }}
          className="flex flex-col min-h-screen bg-[var(--c-bg)]"
      >
        {/* Topnav */}
        <div className="flex items-center justify-between w-full px-2 py-2">
          <button
              className="px-3 py-1 rounded-full border border-[var(--c-border)] text-[var(--c-muted)] text-xs font-medium hover:bg-[var(--c-surface)] transition-colors"
              onClick={() => setActiveScreen("screen-intro")}
              style={{ fontFamily: 'var(--font-body)' }}
          >
            ← Exit
          </button>
          <span className="inline-block text-xs font-medium tracking-[0.12em] uppercase bg-[var(--c-primary)]/10 px-4 py-1 rounded-full text-[var(--c-eyebrow-text)]"
                style={{ fontFamily: 'var(--font-body)' }}>
                {currentDifficulty}
          </span>
          <button
              className="px-4 py-1 rounded-full border border-[var(--c-border)] text-[var(--c-muted)] text-xs font-medium hover:bg-[var(--c-surface)] transition-colors"
              onClick={() => setRulesModalVisible(true)}
              style={{ fontFamily: 'var(--font-body)' }}
          >
            Rules
          </button>
        </div>

        {/* Corps principal */}
        <div className="flex flex-1 flex-col md:flex-row gap-3 md:gap-6 px-4 md:px-6 py-3 md:py-6">

          {/* Colonne gauche */}
          <div className="flex flex-col items-center justify-center gap-2 md:gap-6 md:w-1/2">
            <img
                className="w-65 md:w-170 object-contain"
                src={hangmanImageSrc}
                alt="hangman"
            />
            <p className="text-sm text-center text-[var(--c-text)] italic max-w-xs bg-[var(--c-surface)]/60 rounded-xl px-4 py-3">
              <span className="font-bold not-italic">Hint : </span>{currentHint}
            </p>
            <button
                className="px-6 py-2 rounded-full bg-[var(--c-accent)] text-[var(--c-accent-text)] font-medium text-sm hover:bg-[var(--c-accent)] transition-colors"
                onClick={() => skipWord()}
                style={{ fontFamily: 'var(--font-display)' }}
            >
              Skip — <span className="font-bold">{skipCostText}</span>
            </button>
          </div>

          {/* Colonne droite */}
          <div className="relative flex flex-col items-center justify-center gap-3 md:gap-6 md:w-1/2">

            {/* Mot à deviner */}
            <ul className="flex flex-wrap justify-center gap-2 mt-1 md:mt-4">
              {currentWord.split("").map((ch, idx) => (
                  <li key={idx} className="w-6 h-10 md:w-9 md:h-12 flex items-end justify-center pb-1 border-b-4 border-[var(--c-primary)]">
                    <span className={`font-mono font-bold text-lg md:text-2xl text-[var(--c-primary)] transition-all duration-300 ${guessedLetters.includes(ch) ? "opacity-100" : "opacity-0"}`}>
                      {guessedLetters.includes(ch) ? ch : ""}
                    </span>
                  </li>
              ))}
            </ul>

            {/* Tentatives */}
            <p className="text-sm font-medium text-[var(--c-text)]">
              Attempts left : <span className="font-bold text-[var(--c-primary)]">{attemptsLeft}</span>
            </p>

            {/* Clavier */}
            <div
                className="grid grid-cols-5 gap-1 md:gap-2 w-full max-w-xs"
                onClick={onKeyboardClick}
            >
              {ALPHABET.map((letter) => {
                const isGuessed = guessedLetters.includes(letter);
                const isCorrect = isGuessed && currentWord.includes(letter);
                const isWrong = isGuessed && !currentWord.includes(letter);
                return (
                    <button
                        key={letter}
                        data-letter={letter}
                        disabled={isGuessed || !gameActive}
                        className={`
                          keyboard-key h-10 rounded-lg font-bold text-sm transition-all
                          border border-[var(--c-primary)]/40
                          ${isCorrect ? "key-correct"
                            : isWrong ? "key-wrong"
                                : "text-[var(--c-text)] hover:bg-[var(--c-primary)] hover:text-white shadow-sm"}
                        `}
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {letter}
                    </button>
                );
              })}
            </div>

            {/* Bulle score */}
            <div className="self-end flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--c-accent)] shadow-md juicy__hover">
              <span className="text-sm font-bold text-[var(--c-accent-text)]">{score}</span>
              <span className="text-xs text-[var(--c-accent-text)]">pts</span>
            </div>

          </div>
        </div>

        <p className="text-xs text-[var(--c-text)] opacity-50 text-center py-2">
          Copyrights © 2026 Hangman Game by Match IT
        </p>

      </div>

      {/* End screen */}
      <div
          id="screen-end"
          style={{ display: activeScreen === "screen-end" ? "flex" : "none" }}
          className={`
            flex flex-col items-center justify-start gap-3 px-8
            min-h-screen
            pt-[calc(var(--topbar-h)+2rem)] pb-10
            transition-colors duration-500
            ${endResult === "win" ? "bg-[var(--c-primary)]" : "bg-[var(--c-accent)]"}
            ${shaking ? "juicy__screenshake" : ""}
          `}
      >
        <h1 className={`text-5xl font-bold m-0 ${endResult === "win" ? "text-[var(--c-surface)]" : "text-[var(--c-text)]"}`}
            style={{ fontFamily: 'var(--font-display)' }}>
          {endResult === "win" ? "🎉 Success!" : "💀 Game Over"}
        </h1>

        <div className="w-40 md:w-56 h-40 md:h-56 flex items-center justify-center">
          {activeScreen === "screen-end" && (
              <img
                  src={`/images/${theme === 'dark' ? 'dark' : 'light'}/${endResult === 'win' ? 'success' : 'dead'}.png`}
                  alt={endResult === 'win' ? 'Success' : 'Game over'}
                  className="w-50 md:w-80 object-contain"
              />
          )}
        </div>

        <p className={`text-sm font-medium ${endResult === "win" ? "text-[var(--c-surface)]" : "text-[var(--c-text)]"}`}>
          The correct word was
        </p>
        <p className={`text-2xl font-mono font-bold tracking-widest ${endResult === "win" ? "text-[var(--c-surface)]" : "text-[var(--c-text)]"}`}>
          {currentWord}
        </p>

        {lastRoundBonus > 0 && (
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--c-surface)]/30 text-[var(--c-surface)] font-semibold text-sm shadow-md">
            <span>⭐</span>
            <span>Perfect round! +{lastRoundBonus} bonus pts</span>
          </div>
        )}
        {lastRoundBonus < 0 && (
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--c-text)]/20 text-[var(--c-text)] font-semibold text-sm shadow-md">
            <span>💸</span>
            <span> - {Math.abs(lastRoundBonus)} pts!</span>
          </div>
        )}

        <div className={`px-6 py-3 rounded-full text-2xl font-bold shadow-md ${endResult === "win" ? "bg-[var(--c-surface)]/30 text-[var(--c-surface)]" : "bg-[var(--c-surface)]/60 text-[var(--c-text)]"}`}>
          {score} pts
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {endResult === "win" && (
              <>
                <button
                    className="w-full py-3 rounded-full bg-[var(--c-surface)]/30 text-[var(--c-surface)] font-bold text-lg hover:bg-white/50 transition-colors"
                    onClick={() => startGame(currentDifficulty)}
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                  Play again
                </button>
                {currentDifficulty !== "hard" && (
                    <button
                        className="w-full py-3 rounded-full bg-[var(--c-surface)] text-[var(--c-primary)] font-bold text-lg hover:brightness-95 transition-all"
                        onClick={() => {
                          if (currentDifficulty === "easy") startGame("medium");
                          else if (currentDifficulty === "medium") startGame("hard");
                        }}
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Next Level ↑
                    </button>
                )}
              </>
          )}
          {endResult === "loss" && (
              <button
                  className="w-full py-3 rounded-full bg-[var(--c-text)] text-[var(--c-surface)] font-bold text-lg hover:brightness-110 transition-all"
                  onClick={() => startGame(currentDifficulty)}
                  style={{ fontFamily: 'var(--font-display)' }}
              >
                Try again
              </button>
          )}
          <button
              className={`w-full py-3 rounded-full border-2 font-bold text-lg transition-colors
        ${endResult === "win"
                  ? "border-[var(--c-surface)] text-[var(--c-surface)] hover:bg-white/20"
                  : "border-[var(--c-text)] text-[var(--c-text)] hover:bg-black/10"
              }`}
              onClick={() => setActiveScreen("screen-intro")}
              style={{ fontFamily: 'var(--font-display)' }}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
