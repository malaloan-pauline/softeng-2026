import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { QUIZ_QUESTIONS, CATEGORY_INFO, QuizCategory } from './quizData'
import './Quiz.css'

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function Quiz() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState(() => shuffleArray(QUIZ_QUESTIONS))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<QuizCategory, number>>({
    'Mathematics': 0,
    'Programming': 0,
    'Data Analysis/Statistics': 0,
    'Graphics': 0,
    'Algorithms/Problem-solving': 0,
    'Operating Systems/CS Fundamentals': 0,
  })
  const [showResults, setShowResults] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  
  // Swipe state : 
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex) / QUIZ_QUESTIONS.length) * 100

  const startQuiz = () => {setShowIntro(false)}

  // Handle swipe/answer : 
  const handleAnswer = (liked: boolean) => {
    const category = currentQuestion.category
    
    setAnswers(prev => ({
      ...prev,
      [category]: prev[category] + (liked ? 1 : 0)
    }))

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  // Swipe handlers : 
  const handleDragStart = (clientX: number) => {
    setIsDragging(true)
    setStartX(clientX)
    setCurrentX(clientX)
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    setCurrentX(clientX)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    const diff = currentX - startX
    const threshold = 100 // pixels to trigger swipe
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped right = liked
        handleAnswer(true)
      } else {
        // Swiped left = disliked
        handleAnswer(false)
      }
    }
    
    setCurrentX(0)
    setStartX(0)
  }

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX)
  }

  const onMouseUp = () => {
    handleDragEnd()
  }

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX)
  }

  const onTouchEnd = () => {
    handleDragEnd()
  }

  // Calculate card transform
  const getCardStyle = () => {
    if (!isDragging) return {}
    
    const diff = currentX - startX
    const rotation = diff / 20 // rotation based on drag
    
    return {
      transform: `translateX(${diff}px) rotate(${rotation}deg)`,
      transition: 'none'
    }
  }

  // Calculate results
  const getTopCategories = () => {
    return Object.entries(answers)
      .map(([category, score]) => ({
        category: category as QuizCategory,
        score,
        percentage: (score / 5) * 100
      }))
      .sort((a, b) => b.score - a.score)
  }

  // Restart quiz
  const restartQuiz = () => {
    setQuestions(shuffleArray(QUIZ_QUESTIONS))
    setCurrentIndex(0)
    setAnswers({
      'Mathematics': 0,
      'Programming': 0,
      'Data Analysis/Statistics': 0,
      'Graphics': 0,
      'Algorithms/Problem-solving': 0,
      'Operating Systems/CS Fundamentals': 0,
    })
    setShowResults(false)
    setShowIntro(true)
  }

  if (showIntro) {
    return (
      <div className="quiz-container">
        <div className="intro-screen">
          <button onClick={() => navigate('/')} className="back-home-btn">
          ← Back home
        </button>
          <h1 className="intro-title">IT Match Quiz</h1>
          <h2>What's your ideal BINFO course match ?</h2>
          <p className="intro-subtitle">
            Swipe right if you like it, left if you don't. <br />
            We'll match you to your perfect BINFO subjects. 
          </p>
          <button onClick={startQuiz} className="start-btn">
            Let's Go →
          </button>
        </div>
      </div>
    )
  }

  if (showResults) {
    const results = getTopCategories()
    
    return (
      <div className="quiz-container">
        <div className="results-screen">
          <h1>Your Course Profile</h1>
          <p className="results-subtitle">Based on your answers, here are your best matches</p>
          
          <div className="results-list">
            {results.map(({ category, score, percentage }) => (
              <div key={category} className="result-item">
                <div className="result-header">
                  <h3>{CATEGORY_INFO[category].name}</h3>
                  <span className="result-score">{percentage.toFixed(0)}%</span>
                </div>
                <p className="result-description">{CATEGORY_INFO[category].description}</p>
                <div className="result-courses">
                  {CATEGORY_INFO[category].relatedCourses.join(' • ')}
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={restartQuiz} className="restart-btn">
            Retake Quiz →
          </button>
          <button onClick={() => navigate('/')} className="back-home-btn">
            ← Back home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      <div className="quiz-screen">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">
          Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
        </div>

        {/* Card */}
        <div className="card-container">
          <div 
            ref={cardRef}
            className="quiz-card"
            style={getCardStyle()}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <p className="card-text">{currentQuestion.text}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="button-container">
          <button onClick={() => handleAnswer(false)} className="btn-no">
            ✕
          </button>
          <button onClick={() => handleAnswer(true)} className="btn-yes">
            ❤
          </button>
        </div>

        {/* Swipe hint */}
        <p className="swipe-hint">Swipe the card or use the buttons</p>
      </div>
    </div>
  )
}