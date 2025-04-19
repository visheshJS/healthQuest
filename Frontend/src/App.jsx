import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import DiagnosisDetective from './pages/DiagnosisDetective'
import AnatomyQuiz from './pages/AnatomyQuiz'
import MedicalTrivia from './pages/MedicalTrivia'
import NotFound from './pages/NotFound'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/diagnosis-game" element={<DiagnosisDetective />} />
        <Route path="/anatomy-quiz" element={<AnatomyQuiz />} />
        <Route path="/medical-trivia" element={<MedicalTrivia />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App 