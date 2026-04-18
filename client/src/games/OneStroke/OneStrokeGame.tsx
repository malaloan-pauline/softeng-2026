import React, { useState } from 'react';
import { levels } from './levels';
import './OneStrokeGame.css';
import PuzzleCanvas from './PuzzleCanvas'; 

// ─────────────────────────────────────────────
// The screen the user is currently on:
//   'home'    → the title/welcome screen
//   'playing' → the actual puzzle
//   'win'     → the "you solved it!" screen
// ─────────────────────────────────────────────
type Screen = 'home' | 'playing' | 'win';

// ─────────────────────────────────────────────
// OneStrokeGame — the top-level page component
// ─────────────────────────────────────────────
export default function OneStrokeGame() {
  // Which screen is showing right now?
  const [screen, setScreen] = useState<Screen>('home');

  // Which level (0-indexed) is the player on?
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  // The current level object (nodes, edges, name, difficulty...)
  const currentLevel = levels[currentLevelIndex];

  // Called when the player clicks a level card on the home screen
  function handleSelectLevel(index: number) {
    setCurrentLevelIndex(index);
    setScreen('playing');
  }

  // Called when the player solves the puzzle
  function handleWin() {
    setScreen('win');
  }

  // Called when the player wants to go back to the level list
  function handleBackHome() {
    setScreen('home');
  }

  // Called when the player advances to the next level
  function handleNextLevel() {
    const nextIndex = currentLevelIndex + 1;
    if (nextIndex < levels.length) {
      setCurrentLevelIndex(nextIndex);
      setScreen('playing');
    } else {
      // No more levels → back to home
      setScreen('home');
    }
  }

  return (
    <div className="game-container">

      {/* OME SCREEN */}
      {screen === 'home' && (
        <HomeScreen onSelectLevel={handleSelectLevel} />
      )}

      {/* PLAYING SCREEN */}
      {screen === 'playing' && (
        <div className="playing-screen">
          <span className="difficulty-pill">
            {currentLevel.difficulty}
          </span>
          <PuzzleCanvas
            level={currentLevel}
            onWin={handleWin}
          />
          <button className="btn btn-secondary" onClick={handleBackHome}>
            ← Back
          </button>
        </div>
      )}

      {/* WIN SCREEN */}
      {screen === 'win' && (
        <WinScreen
          levelName={currentLevel.name}
          isLastLevel={currentLevelIndex === levels.length - 1}
          onNext={handleNextLevel}
          onHome={handleBackHome}
        />
      )}

    </div>
  );
}

// HomeScreen — level selection list

interface HomeScreenProps {
  onSelectLevel: (index: number) => void;
}

function HomeScreen({ onSelectLevel }: HomeScreenProps) {
  return (
    <div className="home-screen">
      <h1 className="game-title">One Stroke</h1>
      <p className="game-subtitle">Tap on each node to make the shape !</p>

      <div className="level-list">
        {levels.map((level, index) => (
          <button
            key={level.id}
            className={`level-card difficulty-${level.difficulty.toLowerCase()}`}
            onClick={() => onSelectLevel(index)}
          >
            <span className="level-difficulty">{level.difficulty}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// WinScreen — shown when puzzle is solved
// ─────────────────────────────────────────────
interface WinScreenProps {
  levelName: string;
  isLastLevel: boolean;
  onNext: () => void;
  onHome: () => void;
}

function WinScreen({ levelName, isLastLevel, onNext, onHome }: WinScreenProps) {
  return (
    <div className="win-screen">
      <div className="win-emoji">🎉</div>
      <h2>You did it!</h2>
      <p>You completed <strong>{levelName}</strong> in one stroke!</p>

      <div className="win-buttons">
        {!isLastLevel && (
          <button className="btn btn-primary" onClick={onNext}>
            Next Level →
          </button>
        )}
        <button className="btn btn-secondary" onClick={onHome}>
          ← Level Select
        </button>
      </div>
    </div>
  );
}