import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<div>Games page</div>} />
        <Route path="/quiz" element={<div>IT Match Quiz</div>} />
        <Route path="/feedback" element={<div>Students Feedback</div>} />
        <Route path="/leaderboard" element={<div>Leaderboard</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App