import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import Hangman from './games/hangman'
import OneStrokeGame from './games/OneStroke/OneStrokeGame'
import ClickerGame from './games/clicker/ClickerGame'
import TicTacToe from "./components/tictactoe";
import "./App.css";   



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<div>Games page</div>} />
        <Route path="/quiz" element={<div>IT Match Quiz</div>} />
        <Route path="/feedback" element={<div>Students Feedback</div>} />
        <Route path="/leaderboard" element={<div>Leaderboard</div>} />
        <Route path="/games/hangman" element={<Hangman />} />
        <Route path="/games/tictactoe" element={<TicTacToe />} />
        <Route path="/games/clicker" element={<ClickerGame />} />
        <Route path="/games/onestroke" element={<OneStrokeGame />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

  

export default App;
