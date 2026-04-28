import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import Hangman from "./games/hangman";

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
        <Route path="*" element={<Navigate to="/games/hangman" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App