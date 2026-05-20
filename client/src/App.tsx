import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import UsernameModal from "./user-system/UsernameModal";
import "./App.css";


function App() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('matchit_player')) {
      setShowModal(true);
    }
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
