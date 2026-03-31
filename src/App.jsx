import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Games from './pages/Games'
import Quiz from './pages/Quiz'
import Leaderboard from './pages/Leaderboard'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games" element={<Games />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
