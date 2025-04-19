import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { initAuth } from './utils/auth'

// Initialize auth
initAuth();

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import AnatomyQuiz from './pages/AnatomyQuiz'
import DiagnosisDetective from './pages/DiagnosisDetective'
import MedicalTrivia from './pages/MedicalTrivia'

// Components
import ProtectedRoute from './components/ProtectedRoute'

// Styles
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            border: '1px solid #555',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/anatomy-quiz" 
          element={
            <ProtectedRoute>
              <AnatomyQuiz />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/diagnosis-game" 
          element={
            <ProtectedRoute>
              <DiagnosisDetective />
            </ProtectedRoute>
          } 
        />
       
        <Route 
          path="/medical-trivia" 
          element={
            <ProtectedRoute>
              <MedicalTrivia />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
) 