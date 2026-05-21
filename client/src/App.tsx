import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { API_URL } from './config/api';
import HomePage from "./pages/HomePage/HomePage";
import Hangman from "./games/hangman/index";
import OneStrokeGame from "./games/OneStroke/OneStrokeGame";
import ClickerGame from "./games/clicker/ClickerGame";
import TicTacToe from "./games/tictactoe/tictactoe";
import Quiz from './pages/Quiz/Quiz'
import GamesPage from './pages/GamesPage/GamesPage';
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import FeedbacksPage from './pages/FeedbacksPage/FeedbacksPage';
import Topbar from "./components/Topbar/Topbar";
import UsernameModal from "./user-system/Username";
import "./App.css";


function App() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('matchit_player')) {
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('matchit_player');
    if (!stored) return;
    const { uuid, pseudo, avatarUrl } = JSON.parse(stored);

    // Silently sync pseudo and avatarUrl to database on every app load
    fetch(`${API_URL}/api/leaderboard/player`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid, pseudo, avatarUrl }),
    }).catch(() => {
      // Fail silently, this is a background sync
    });
  }, []);

  return (
    <BrowserRouter>
      {showModal && <UsernameModal onClose={() => setShowModal(false)} />}
      <Topbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/quiz" element={<Quiz/>} />
        <Route path="/feedback" element={<FeedbacksPage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/games/hangman" element={<Hangman />} />
        <Route path="/games/tictactoe" element={<TicTacToe />} />
        <Route path="/games/clicker" element={<ClickerGame />} />
        <Route path="/games/onestroke" element={<OneStrokeGame />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
