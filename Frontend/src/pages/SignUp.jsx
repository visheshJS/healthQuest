import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Particles } from '../components/particles'
import { EyeIcon, EyeOffIcon, CheckCircle } from 'lucide-react'

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, we would validate and register the user here
    navigate('/dashboard')
  }

  const passwordStrength = (pass) => {
    let strength = 0
    if (pass.length >= 8) strength += 1
    if (/[A-Z]/.test(pass)) strength += 1
    if (/[0-9]/.test(pass)) strength += 1
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1
    return strength
  }

  const getPasswordStrengthColor = () => {
    const strength = passwordStrength(password)
    if (strength === 0) return 'bg-transparent'
    if (strength === 1) return 'bg-red-500'
    if (strength === 2) return 'bg-yellow-500'
    if (strength === 3) return 'bg-blue-500'
    return 'bg-green-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 text-white relative overflow-hidden">
      <Particles className="absolute inset-0 z-0" quantity={30} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center py-6">
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
            <span className="text-2xl font-russo text-green-300 tracking-wider">
              HEALTH<span className="text-white">BT</span>
            </span>
          </Link>
        </div>
        
        <div className="max-w-md mx-auto mt-12 p-8 bg-black/30 backdrop-blur-xl border border-green-500/20 rounded-xl">
          <h2 className="text-3xl font-russo text-center mb-8 text-green-300">CREATE ACCOUNT</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                placeholder="john.doe@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="profession" className="block text-sm font-medium mb-2">Profession</label>
              <select
                id="profession"
                className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                required
              >
                <option value="" disabled selected>Select your profession</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="student">Medical Student</option>
                <option value="other">Other Healthcare Professional</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              <div className="mt-1">
                <div className="w-full h-1 bg-black/30 rounded overflow-hidden">
                  <div className={`h-full ${getPasswordStrengthColor()}`} style={{ width: `${passwordStrength(password) * 25}%` }}></div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <div className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-300' : 'text-white/50'}`}>
                    <CheckCircle size={12} className="mr-1" />
                    Uppercase
                  </div>
                  <div className={`flex items-center ${/[0-9]/.test(password) ? 'text-green-300' : 'text-white/50'}`}>
                    <CheckCircle size={12} className="mr-1" />
                    Number
                  </div>
                  <div className={`flex items-center ${/[^A-Za-z0-9]/.test(password) ? 'text-green-300' : 'text-white/50'}`}>
                    <CheckCircle size={12} className="mr-1" />
                    Symbol
                  </div>
                  <div className={`flex items-center ${password.length >= 8 ? 'text-green-300' : 'text-white/50'}`}>
                    <CheckCircle size={12} className="mr-1" />
                    8+ Characters
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-green-500/30 bg-black/50 text-green-500 focus:ring-green-500/50"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm">
                I agree to the <a href="#" className="text-green-300 hover:text-green-200">Terms of Service</a> and <a href="#" className="text-green-300 hover:text-green-200">Privacy Policy</a>
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full game-button py-3 px-4 flex justify-center mt-6"
            >
              CREATE ACCOUNT
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p>Already have an account? <Link to="/login" className="text-green-300 hover:text-green-200">Login</Link></p>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-40 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
    </div>
  )
}

export default SignUp 