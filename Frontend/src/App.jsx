import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import DiagnosisDetective from './pages/DiagnosisDetective'
import AnatomyQuiz from './pages/AnatomyQuiz'
import MedicalTrivia from './pages/MedicalTrivia'
import NotFound from './pages/NotFound'
import CompetitiveMode from './pages/CompetitiveMode'

// Components
import ErrorBoundary from './components/ErrorBoundary'

// Add API configuration
const API_CONFIG = {
  BASE_URL: 'https://healthquestgame.onrender.com',
  API_PATH: '/api',
  AVATARS_PATH: '/avatars'
};

// Export for use in other components
export const getApiUrl = (path = '') => `${API_CONFIG.BASE_URL}${API_CONFIG.API_PATH}${path}`;
export const getAvatarUrl = (filename = 'default.png') => {
  // For local development or if it's already a full URL
  if (filename.startsWith('http') || filename.startsWith('/')) {
    return filename;
  }
  
  // For deployed app
  return `${API_CONFIG.BASE_URL}${API_CONFIG.AVATARS_PATH}/${filename}`;
};

// Handle avatar loading errors
export const handleAvatarError = (event) => {
  event.target.src = '/avatars/default.png';
};

function App() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to home by default
    if (window.location.pathname === '/') {
      navigate('/');
    }
    
    // Log API configuration
    console.log('API Configuration:', {
      baseUrl: API_CONFIG.BASE_URL,
      apiPath: API_CONFIG.API_PATH,
      avatarsPath: API_CONFIG.AVATARS_PATH,
      fullApiUrl: getApiUrl(),
      avatarExample: getAvatarUrl()
    });
  }, [navigate]);
  
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
        <Route path="/competitive-mode" element={
          <ErrorBoundary>
            <CompetitiveMode />
          </ErrorBoundary>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App 