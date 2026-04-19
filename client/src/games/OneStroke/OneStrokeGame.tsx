import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { levels } from './levels';
import './OneStrokeGame.css';
import PuzzleCanvas from './PuzzleCanvas';

type Screen = 'home' | 'playing' | 'win';

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function OneStrokeGame() {
  const [screen, setScreen] = useState<Screen>('home');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const currentLevel = levels[currentLevelIndex];
  const navigate = useNavigate();

  useEffect(() => {
    let interval: number | undefined;

    if (screen === 'playing' && timerRunning) {
      interval = window.setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
  }, [screen, timerRunning]);

  function handleSelectLevel(index: number) {
    setCurrentLevelIndex(index);
    setElapsedTime(0);
    setTimerRunning(false);
    setScreen('playing');
  }

  function handleFirstMove() {
    setTimerRunning (true);
  }

  function handleRetry() {
    setElapsedTime(0);
    setTimerRunning(false);
  }

  function handleWin() {
    setTimerRunning(false);
    setScreen('win');
  }

  function handleBackHome() {
    setElapsedTime(0);
    setTimerRunning(false);
    setScreen('home');
  }

  function handleNextLevel() {
    const nextIndex = currentLevelIndex + 1;

    if (nextIndex < levels.length) {
      setCurrentLevelIndex(nextIndex);
      setElapsedTime(0);
      setTimerRunning(false);
      setScreen('playing');
    } else {
      setElapsedTime(0);
      setTimerRunning(false);
      setScreen('home');
    }
  }

  return (
    <div className="game-container">
      {screen === 'home' && (
        <>
          <button className="btn-back-menu" onClick={() => navigate('/games')}>
            ← Game menu
          </button>
          <HomeScreen onSelectLevel={handleSelectLevel} />
        </>
      )}

      {screen === 'playing' && (
        <div className="playing-screen">
          <span className="difficulty-pill">
            {currentLevel.difficulty}
          </span>

          <div className="timer-pill">
            ⏱ {formatTime(elapsedTime)}
          </div>

          <PuzzleCanvas
            level={currentLevel}
            onWin={handleWin}
            onFirstMove={handleFirstMove}
            onRetry={handleRetry}
          />

          <button className="btn btn-secondary" onClick={handleBackHome}>
            ← Back
          </button>
        </div>
      )}

      {screen === 'win' && (
        <WinScreen
          levelName={currentLevel.name}
          elapsedTime={elapsedTime}
          isLastLevel={currentLevelIndex === levels.length - 1}
          onNext={handleNextLevel}
          onHome={handleBackHome}
        />
      )}
    </div>
  );
}

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

interface WinScreenProps {
  levelName: string;
  elapsedTime: number;
  isLastLevel: boolean;
  onNext: () => void;
  onHome: () => void;
}

function WinScreen({
  levelName,
  elapsedTime,
  isLastLevel,
  onNext,
  onHome,
}: WinScreenProps) {
  return (
    <div className="win-screen">
      <h2>You did it!</h2>
      <p>
        You completed <strong>{levelName}</strong> in {formatTime(elapsedTime)}!
      </p>

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