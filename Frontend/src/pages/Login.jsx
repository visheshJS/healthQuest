import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Particles } from '../components/particles'
import { EyeIcon, EyeOffIcon, Home } from 'lucide-react'
import { login } from '../utils/auth'
import { toast } from 'react-hot-toast'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  
  // Clear error message when inputs change
  useEffect(() => {
    if (errorMessage) setErrorMessage('');
  }, [email, password]);
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    
    // Basic validation
    if (!email || !password) {
      toast.error("Please fill in all fields")
      setErrorMessage("All fields are required")
      return
    }
    
    try {
      setIsLoading(true)
      console.log('Submitting login form for:', email)
      
      const result = await login(email, password)
      
      console.log('Login result:', result)
      
      if (result.success) {
        toast.success("Login successful!")
        navigate('/dashboard')
      } else {
        console.error('Login failed:', result.message)
        setErrorMessage(result.message || "Login failed")
        toast.error(result.message || "Login failed. Please try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrorMessage(error.message || "An unexpected error occurred")
      toast.error("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 text-white relative overflow-hidden">
      <Particles className="absolute inset-0 z-0" quantity={30} />
      
      <div className="container mx-auto px-4 py-4 sm:py-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 gap-4 sm:gap-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/30 border border-green-400/50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-russo text-green-300 tracking-wider">
              HEALTH<span className="text-white">QUEST</span>
            </span>
          </Link>
          
          <Link to="/" className="game-button-small py-2 px-4 flex items-center">
            <Home className="w-4 h-4 mr-2" />
            HOME
          </Link>
        </div>
        
        <div className="max-w-md mx-auto mt-6 sm:mt-12 p-6 sm:p-8 bg-black/30 backdrop-blur-xl border border-green-500/20 rounded-xl">
          <h2 className="text-2xl sm:text-3xl font-russo text-center mb-6 sm:mb-8 text-green-300">LOGIN</h2>
          
          {errorMessage && (
            <div className="bg-red-900/40 border border-red-500/50 p-3 rounded-lg text-white mb-4">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                placeholder="john.doe@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full game-button py-3 px-4 flex justify-center mt-6"
            >
              {isLoading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm sm:text-base">Don't have an account? <Link to="/signup" className="text-green-300 hover:text-green-200">Create Account</Link></p>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-40 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
    </div>
  )
}

export default Login 