import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti'; 
import { levels } from './levels';
import './OneStrokeGame.css';
import PuzzleCanvas from './PuzzleCanvas';

type Screen = 'home' | 'playing' | 'win';

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getPointsForDifficulty(difficulty: string): number {
  switch (difficulty) {
    case 'Easy':
      return 5;
    case 'Medium':
      return 6;
    case 'Hard':
      return 8;
    case 'Challenge':
      return 15;
    default:
      return 0;
  }
}
export default function OneStrokeGame() {
  const [screen, setScreen] = useState<Screen>('home');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const currentLevel = levels[currentLevelIndex];
  const navigate = useNavigate();
  const [lastPointsEarned, setLastPointsEarned] = useState<number>(() => {
  return Number(sessionStorage.getItem('oneStrokePoints') || 0);
  });

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

  const pointsEarned = getPointsForDifficulty(currentLevel.difficulty);
  const previousPoints = Number(sessionStorage.getItem('oneStrokePoints') || 0);
  const totalPoints = previousPoints + pointsEarned;

  setLastPointsEarned(totalPoints);
  sessionStorage.setItem('oneStrokePoints', String(totalPoints));

    console.log({
      game: 'OneStroke',
      difficulty: currentLevel.difficulty,
      points: pointsEarned,
    });

    setScreen('win');
  }

  function handleBackHome() {
    setElapsedTime(0);
    setTimerRunning(false);
    setScreen('home');
  }

  function handleResetPoints() {
  setLastPointsEarned(0);
  sessionStorage.setItem('oneStrokePoints', '0');
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
      <div className="points-panel">
            <div className="points-box">
            Total points : {lastPointsEarned} 
            </div>
      </div>

      {screen === 'home' && (
        <>
          <button className="btn-back-menu" onClick={() => navigate('/games')}>
            ← Game menu
          </button>
          <HomeScreen onSelectLevel={handleSelectLevel} />

            <button
              type="button"
              className="reset-points-button reset-points-floating"
              onClick={handleResetPoints}
            >
              Reset points
            </button>
        </>
        
      )}

      {screen === 'playing' && (
        <div className="playing-screen">
          <span className="difficulty-pill">
            <strong>{currentLevel.difficulty}</strong>
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
          levelName={currentLevel.difficulty}
          elapsedTime={elapsedTime}
          pointsEarned={getPointsForDifficulty(currentLevel.difficulty)}
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
      <footer className="game-footer">
        Copyright © 2026 One Stroke game by Match IT 
      </footer>
    </div>
  );
}

interface WinScreenProps {
  levelName: string;
  elapsedTime: number;
  pointsEarned: number;
  isLastLevel: boolean;
  onNext: () => void;
  onHome: () => void;
}

function WinScreen({
  levelName,
  elapsedTime,
  pointsEarned,
  isLastLevel,
  onNext,
  onHome,
}: WinScreenProps) { 
  useEffect(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.6 },
      colors: ['#7a9e7e', '#e8e4d4', '#5c7a60', '#d4c9a8', '#a0c4a4'],
    });

    confetti({
      particleCount: 80,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.6 },
      colors: ['#7a9e7e', '#e8e4d4', '#5c7a60', '#d4c9a8', '#a0c4a4'],
    });
  }, []);
  
  return (
    <div className="win-screen">
      <h2>You did it!</h2>
      <p>
        You completed level <strong>{levelName}</strong> in {formatTime(elapsedTime)}!
      </p>
      <p className="win-points">You won {pointsEarned} points !!</p>

      <div className="win-buttons">
        {!isLastLevel && (
          <button className="btn btn-primary" onClick={onNext}>
            Next Level →
          </button>
        )}
        <button className="btn btn-secondary" onClick={onHome}>
          ← Select Level
        </button>
      </div>
    </div>
  );
}