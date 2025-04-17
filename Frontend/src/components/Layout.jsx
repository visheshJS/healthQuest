import { Link } from 'react-router-dom'
import { Gamepad } from 'lucide-react'

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="flex justify-between items-center py-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-green-500/30 border border-green-400/50 flex items-center justify-center animate-pulse-glow">
              <Gamepad className="w-6 h-6 text-green-300" />
            </div>
            <h1 className="text-3xl font-russo text-green-300 tracking-wider">
              HEALTH<span className="text-white">QUEST</span>
            </h1>
          </Link>
          <div className="flex gap-4">
            <Link to="/login">
              <button
                className="text-white hover:text-white hover:bg-white/20 border border-green-400/30 px-4 py-2 rounded-md font-medium"
              >
                LOGIN
              </button>
            </Link>
            <Link to="/signup">
              <button className="game-button">SIGN UP</button>
            </Link>
          </div>
        </header>

        <main className="py-8">
          {children}
        </main>

        <footer className="mt-32 py-8 border-t border-green-500/20 text-center text-white/60">
          <p>© 2025 HealthQuest. All rights reserved. Made with ❤️ for healthcare education.</p>
        </footer>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-40 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
    </div>
  )
}

export function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center py-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/30 border border-green-400/50 flex items-center justify-center">
              <Gamepad className="w-5 h-5 text-green-300" />
            </div>
            <h1 className="text-2xl font-russo text-green-300 tracking-wider">
              HEALTH<span className="text-white">QUEST</span>
            </h1>
          </Link>
          <div className="flex items-center gap-6">
            <nav>
              <ul className="flex space-x-6">
                <li><Link to="/dashboard" className="text-green-300 hover:text-white">Dashboard</Link></li>
                <li><Link to="/games" className="text-green-300 hover:text-white">Games</Link></li>
                <li><Link to="/" className="text-green-300 hover:text-white">Logout</Link></li>
              </ul>
            </nav>
            <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center text-white">
              U
            </div>
          </div>
        </header>

        <main className="py-6">
          {children}
        </main>

        <footer className="mt-32 py-8 border-t border-green-500/20 text-center text-white/60">
          <p>© 2025 HealthQuest. All rights reserved. Made with ❤️ for healthcare education.</p>
        </footer>
      </div>
    </div>
  )
} 