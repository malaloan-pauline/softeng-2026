import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import HomePage from './pages/HomePage/HomePage'
import Hangman from "./games/hangman";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<App />} />
        <Route path="/games/hangman" element={<Hangman />} />
        <Route path="/games" element={<div>Games page</div>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)