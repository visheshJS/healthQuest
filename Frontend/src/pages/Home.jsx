import { Link } from "react-router-dom";
import {
  ArrowRight,
  Gamepad,
  Brain,
  Trophy,
  Heart,
  Zap,
  Star,
  Menu,
  X,
} from "lucide-react";
import { Particles } from "../components/particles";
import { useState } from "react";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 text-white relative overflow-hidden">
      <Particles className="absolute inset-0 z-0" quantity={50} />

      <div className="container mx-auto px-4 py-4 sm:py-8 relative z-10">
        <header className="flex justify-between items-center py-4 sm:py-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-500/30 border border-green-400/50 flex items-center justify-center animate-pulse-glow">
              <Gamepad className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" />
            </div>
            <h1 className="text-xl sm:text-3xl font-russo text-green-300 tracking-wider">
              HEALTH<span className="text-white">QUEST</span>
            </h1>
          </div>
          
          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md bg-green-500/20 text-green-300"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden sm:flex gap-4">
            <Link to="/login">
              <button className="text-white hover:text-white hover:bg-white/20 border border-green-400/30 px-4 py-2 rounded-md font-medium">
                LOGIN
              </button>
            </Link>
            <Link to="/signup">
              <button className="game-button">SIGN UP</button>
            </Link>
          </div>
        </header>
        
        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden bg-black/60 backdrop-blur-md rounded-lg mt-2 p-4 border border-green-500/30 animate-fadeIn">
            <div className="flex flex-col gap-3">
              <Link to="/login" className="w-full">
                <button className="w-full text-white hover:text-white hover:bg-white/20 border border-green-400/30 px-4 py-3 rounded-md font-medium">
                  LOGIN
                </button>
              </Link>
              <Link to="/signup" className="w-full">
                <button className="w-full game-button py-3">SIGN UP</button>
              </Link>
            </div>
          </div>
        )}

        <main className="py-10 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-4 flex justify-center">
              <div className="px-3 sm:px-4 py-1 sm:py-2 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-xs sm:text-sm font-medium animate-pulse">
                LEVEL UP YOUR MEDICAL KNOWLEDGE
              </div>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-russo mb-4 sm:mb-6 animate-fadeIn leading-tight">
              MASTER{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                HEALTHCARE
              </span>{" "}
              THROUGH GAMING
            </h2>
            <p className="text-base sm:text-xl mb-6 sm:mb-10 text-white/80 px-2">
              A fun, interactive platform that transforms healthcare education
              into an engaging gaming experience for medical students, nurses,
              and healthcare professionals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link to="/signup" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto game-button text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 animate-float">
                  START YOUR JOURNEY{" "}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 inline" />
                </button>
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto text-white border-green-400/50 hover:bg-green-500/20 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 animate-float-slow border rounded-md">
                  DASHBOARD
                </button>
              </Link>
            </div>
          </div>

          <div className="mt-16 sm:mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
            {[
              {
                title: "Quiz Battles",
                description:
                  "Test your knowledge in fast-paced quiz competitions",
                icon: <Brain className="h-8 w-8" />,
                color: "from-green-400 to-emerald-500",
                delay: "0",
              },
              {
                title: "Anatomy Explorer",
                description:
                  "Identify body parts and systems through interactive challenges",
                icon: <Heart className="h-8 w-8" />,
                color: "from-emerald-400 to-green-500",
                delay: "0.1",
              },
              {
                title: "Diagnosis Detective",
                description:
                  "Solve medical mysteries by analyzing symptoms and patient histories",
                icon: <Zap className="h-8 w-8" />,
                color: "from-green-400 to-teal-500",
                delay: "0.2",
              },
              {
                title: "Competitive Mode",
                description:
                  "Climb the leaderboards and compete with peers worldwide",
                icon: <Trophy className="h-8 w-8" />,
                color: "from-teal-400 to-green-500",
                delay: "0.3",
              },
            ].map((mode, index) => (
              <div
                key={index}
                className="game-card p-5 sm:p-6 animate-float"
                style={{ animationDelay: `${mode.delay}s` }}
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r ${mode.color} mb-4 sm:mb-6 flex items-center justify-center shadow-lg shadow-green-500/20`}
                >
                  {mode.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-russo mb-2 sm:mb-3 text-green-300">
                  {mode.title}
                </h3>
                <p className="text-sm sm:text-base text-white/70">{mode.description}</p>

                <div className="mt-4 sm:mt-6 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-green-400/60 mr-1"
                      fill={i < 4 ? "currentColor" : "none"}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 sm:mt-32 text-center">
            <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              JOIN THOUSANDS OF HEALTHCARE PROFESSIONALS
            </div>
            <h3 className="text-2xl sm:text-4xl font-russo mb-6 sm:mb-10">READY TO PLAY?</h3>
            <div className="flex justify-center">
              <Link to="/signup">
                <button className="game-button text-lg sm:text-xl px-8 sm:px-10 py-6 sm:py-8 animate-pulse-glow">
                  BEGIN YOUR ADVENTURE
                </button>
              </Link>
            </div>
          </div>
        </main>

        <footer className="mt-16 sm:mt-32 py-6 sm:py-8 border-t border-green-500/20 text-center text-white/60 text-sm sm:text-base">
          <p>
            © 2025 HealthQuest. All rights reserved. Made with ❤️ for healthcare
            education.
          </p>
        </footer>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-40 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
    </div>
  );
}

export default Home;
