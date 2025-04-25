import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BarChart3,
  Gamepad,
  Brain,
  Trophy,
  User,
  Heart,
  Zap,
  Star,
  BookOpen,
  Menu,
  X,
  Home,
} from "lucide-react";
import { getCurrentUser } from "../utils/auth";
import LogoutButton from "../components/LogoutButton";
import { Particles } from "../components/particles";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the current user data
    const userData = getCurrentUser();
    setUser(
      userData || {
        username: "Guest",
        level: 1,
        xp: 0,
        completedQuizzes: 0,
        streak: 0,
        recentGames: [],
        achievements: [
          {
            id: "first_steps",
            name: "First Steps",
            description: "Complete your first quiz",
            achieved: false,
          },
          {
            id: "perfect_score",
            name: "Perfect Score",
            description: "Score 100% on any quiz",
            achieved: false,
          },
          {
            id: "weekly_streak",
            name: "Weekly Warrior",
            description: "Maintain a 7-day streak",
            achieved: false,
          },
          {
            id: "monthly_streak",
            name: "Dedication",
            description: "Maintain a 30-day streak",
            achieved: false,
          },
          {
            id: "quiz_master",
            name: "Quiz Master",
            description: "Complete 10 quizzes",
            achieved: false,
          },
          {
            id: "no_mistakes",
            name: "Flawless",
            description: "Complete a quiz without losing a life",
            achieved: false,
          },
        ],
      }
    );
  }, []);

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  };

  const handlePlayGame = (gameType) => {
    if (gameType === "diagnosis") {
      navigate("/diagnosis-game");
    } else if (gameType === "anatomy") {
      navigate("/anatomy-quiz");
    } else if (gameType === "trivia") {
      navigate("/medical-trivia");
    } else if (gameType === "competitive") {
      navigate("/competitive-mode");
    }
  };

  // Calculate XP percentage to next level
  const getXpProgress = () => {
    const level = user?.level || 1;
    const xp = user?.xp || 0;

    let xpForCurrentLevel, xpForNextLevel;

    if (level === 1) {
      xpForCurrentLevel = 0;
      xpForNextLevel = 1000;
    } else if (level === 2) {
      xpForCurrentLevel = 1000;
      xpForNextLevel = 2500;
    } else if (level === 3) {
      xpForCurrentLevel = 2500;
      xpForNextLevel = 5000;
    } else if (level === 4) {
      xpForCurrentLevel = 5000;
      xpForNextLevel = 8000;
    } else {
      // At max level
      return 100;
    }

    const xpInCurrentLevel = xp - xpForCurrentLevel;
    const xpRequiredForNextLevel = xpForNextLevel - xpForCurrentLevel;
    const progressPercentage = Math.min(
      100,
      Math.round((xpInCurrentLevel / xpRequiredForNextLevel) * 100)
    );

    return progressPercentage;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 text-white relative overflow-hidden">
      <Particles className="absolute inset-0 z-0" quantity={30} />

      {/* Header */}
      <header className="relative z-10 border-b border-green-700/50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-500/30 border border-green-400/50 flex items-center justify-center">
              <Gamepad className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
            </div>
            <span className="text-xl sm:text-2xl font-russo text-green-300 tracking-wider">
              HEALTH<span className="text-white">QUEST</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user && (
              <>
                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 rounded-md bg-green-500/20 text-green-300"
                  >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                </div>

                {/* Desktop user info and logout */}
                <div className="hidden md:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-green-300 font-semibold">
                      {user.username}
                    </p>
                    <p className="text-xs text-green-200/70">
                      {user.profession || "Medical Student"}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-800/60 border border-green-400/30 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.username}'s avatar`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://api.dicebear.com/7.x/bottts/svg?seed=fallback&backgroundColor=b6e3f4";
                        }}
                      />
                    ) : (
                      <User size={20} className="text-green-300" />
                    )}
                  </div>
                  <Link
                    to="/"
                    className="game-button-small py-1.5 px-3 flex items-center"
                  >
                    <Home className="w-4 h-4 mr-1.5" />
                    <span className="hidden sm:inline">HOME</span>
                  </Link>
                  <LogoutButton className="game-button-small text-sm" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-black/60 backdrop-blur-md py-3 px-4 border-b border-green-700/30 animate-fadeIn">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-800/60 border border-green-400/30 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.username}'s avatar`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://api.dicebear.com/7.x/bottts/svg?seed=fallback&backgroundColor=b6e3f4";
                    }}
                  />
                ) : (
                  <User size={20} className="text-green-300" />
                )}
              </div>
              <div>
                <p className="text-green-300 font-semibold">{user?.username}</p>
                <p className="text-xs text-green-200/70">
                  {user?.profession || "Medical Student"}
                </p>
              </div>
            </div>
            <LogoutButton className="game-button-small text-sm w-full" />
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-4 sm:py-8 relative z-10">
        {/* Greeting */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-russo mb-1 sm:mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
            Welcome back, {user?.username || "Healer"}!
          </h1>
          <p className="text-sm sm:text-base text-green-100/70">
            Your medical adventure continues. What would you like to play today?
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-10">
          <div className="game-card p-3 sm:p-4">
            <div className="flex justify-between items-start mb-2 sm:mb-3">
              <div>
                <p className="text-green-300/70 text-xs sm:text-sm">
                  Current Level
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {user?.level || 1}
                </h3>
              </div>
              <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg">
                <Trophy className="text-green-300" size={20} />
              </div>
            </div>
            <div className="h-2 bg-black/20 rounded-full mb-2">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-300 rounded-full"
                style={{ width: `${getXpProgress()}%` }}
              ></div>
            </div>
            <p className="text-xs text-green-200/50">
              {user?.xp || 0} XP /{" "}
              {user?.level < 5
                ? user?.level === 1
                  ? "1000 XP to level 2"
                  : user?.level === 2
                  ? "2500 XP to level 3"
                  : user?.level === 3
                  ? "5000 XP to level 4"
                  : "8000 XP to level 5"
                : "MAX LEVEL"}
            </p>
          </div>

          <div className="game-card p-3 sm:p-4">
            <div className="flex justify-between items-start mb-2 sm:mb-3">
              <div>
                <p className="text-green-300/70 text-xs sm:text-sm">
                  Learning Streak
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {user?.streak || 0} days
                </h3>
              </div>
              <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg">
                <Award className="text-green-300" size={20} />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-green-100/70 mt-2">
              Keep your streak going! Log in tomorrow to continue learning.
            </p>
          </div>

          <div className="game-card p-3 sm:p-4 sm:col-span-2 md:col-span-1">
            <div className="flex justify-between items-start mb-2 sm:mb-3">
              <div>
                <p className="text-green-300/70 text-xs sm:text-sm">
                  Quizzes Completed
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {user?.completedQuizzes || 0}
                </h3>
              </div>
              <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg">
                <Brain className="text-green-300" size={20} />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-green-100/70 mt-2">
              You've completed {user?.completedQuizzes || 0} quizzes so far.
            </p>
          </div>
        </div>

        {/* Game Options */}
        <h2 className="text-xl sm:text-3xl font-russo mb-4 sm:mb-6 text-green-300">
          Game Modes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div
            className="game-card p-4 sm:p-6 cursor-pointer transform hover:scale-105 transition-all duration-300"
            onClick={() => handlePlayGame("diagnosis")}
          >
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-2xl font-russo mb-1 sm:mb-2 text-green-300">
                  Diagnosis Detective
                </h3>
                <p className="text-xs sm:text-sm text-green-100/70 mb-2 sm:mb-3">
                  Solve medical mysteries by analyzing symptoms and patient
                  histories
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={`diagnosis-star-${i}`}
                        className="w-3 h-3 sm:w-4 sm:h-4 text-green-400/80 mr-1"
                        fill={i < 4 ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">
                    Hard
                  </span>
                </div>
              </div>
            </div>
            <button className="mt-3 sm:mt-4 w-full game-button-small py-1.5 sm:py-2 text-sm">
              PLAY NOW
            </button>
          </div>

          <div
            className="game-card p-4 sm:p-6 cursor-pointer transform hover:scale-105 transition-all duration-300"
            onClick={() => handlePlayGame("anatomy")}
          >
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-2xl font-russo mb-1 sm:mb-2 text-green-300">
                  Anatomy Quiz
                </h3>
                <p className="text-xs sm:text-sm text-green-100/70 mb-2 sm:mb-3">
                  Test your knowledge of human anatomy through interactive
                  challenges
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={`anatomy-star-${i}`}
                        className="w-3 h-3 sm:w-4 sm:h-4 text-green-400/80 mr-1"
                        fill={i < 3 ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">
                    Medium
                  </span>
                </div>
              </div>
            </div>
            <button className="mt-3 sm:mt-4 w-full game-button-small py-1.5 sm:py-2 text-sm">
              PLAY NOW
            </button>
          </div>

          <div
            className="game-card p-4 sm:p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 order-last md:order-none col-span-1 sm:col-span-2 md:col-span-1 mx-auto md:mx-0 w-full sm:w-1/2 md:w-full"
            onClick={() => handlePlayGame("competitive")}
          >
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-2xl font-russo mb-1 sm:mb-2 text-green-300">
                  Competitive
                </h3>
                <p className="text-xs sm:text-sm text-green-100/70 mb-2 sm:mb-3">
                  Climb the leaderboards and compete with peers worldwide
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={`competitive-star-${i}`}
                        className="w-3 h-3 sm:w-4 sm:h-4 text-green-400/80 mr-1"
                        fill={i < 4 ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">
                    Hard
                  </span>
                </div>
              </div>
            </div>
            <button className="mt-3 sm:mt-4 w-full game-button-small py-1.5 sm:py-2 text-sm">
              PLAY NOW
            </button>
          </div>

          <div
            className="game-card p-4 sm:p-6 cursor-pointer transform hover:scale-105 transition-all duration-300"
            onClick={() => handlePlayGame("trivia")}
          >
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 flex items-center justify-center">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-2xl font-russo mb-1 sm:mb-2 text-green-300">
                  Medical Trivia
                </h3>
                <p className="text-xs sm:text-sm text-green-100/70 mb-2 sm:mb-3">
                  Test your medical knowledge with challenging trivia questions
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={`trivia-star-${i}`}
                        className="w-3 h-3 sm:w-4 sm:h-4 text-green-400/80 mr-1"
                        fill={i < 3 ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">
                    Medium
                  </span>
                </div>
              </div>
            </div>
            <button className="mt-3 sm:mt-4 w-full game-button-small py-1.5 sm:py-2 text-sm">
              PLAY NOW
            </button>
          </div>
        </div>

        {/* Recent Activity and Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2 game-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-russo mb-3 sm:mb-4 flex items-center text-green-300">
              <BarChart3 className="mr-2 text-green-400 w-5 h-5" />
              Recent Activity
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {user?.recentGames && user.recentGames.length > 0 ? (
                user.recentGames.map((game, index) => (
                  <div
                    key={`${game.id}-${index}`}
                    className="border-b border-green-700/30 pb-3 sm:pb-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-500/20 flex items-center justify-center mr-2 sm:mr-3">
                          {game.type.includes("Diagnosis") ? (
                            <Zap className="text-green-300" size={16} />
                          ) : game.type.includes("Anatomy") ? (
                            <Heart className="text-green-300" size={16} />
                          ) : (
                            <BookOpen className="text-green-300" size={16} />
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-medium text-white">
                            {game.type}
                          </h3>
                          <p className="text-xs sm:text-sm text-green-200/70">
                            Score: {game.score}% · {game.xp} XP earned
                          </p>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm text-green-200/50">
                        {formatTimeAgo(game.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 sm:py-6 text-green-200/70">
                  <p className="text-sm">
                    No recent activity yet. Start playing to see your progress!
                  </p>
                </div>
              )}
            </div>

            <button className="mt-4 sm:mt-6 text-green-300 text-xs sm:text-sm font-medium flex items-center hover:text-green-200 transition-colors">
              View all activity <ArrowRight size={14} className="ml-1" />
            </button>
          </div>

          <div className="game-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-russo mb-3 sm:mb-4 flex items-center text-green-300">
              <Trophy className="mr-2 text-yellow-400 w-5 h-5" />
              Achievements
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {user?.achievements &&
                user.achievements.map((achievement, index) => (
                  <div
                    key={`${achievement.id}-${index}`}
                    className={`flex items-center ${
                      !achievement.achieved ? "opacity-50" : ""
                    }`}
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${
                        achievement.achieved
                          ? "bg-green-500/20"
                          : "bg-green-800/60"
                      } flex items-center justify-center mr-3 sm:mr-4`}
                    >
                      <Trophy
                        className={
                          achievement.achieved
                            ? "text-green-300"
                            : "text-green-500/50"
                        }
                        size={20}
                      />
                    </div>
                    <div>
                      <h3
                        className={`text-sm sm:text-base font-medium ${
                          achievement.achieved
                            ? "text-white"
                            : "text-green-300/50"
                        }`}
                      >
                        {achievement.name}
                      </h3>
                      <p
                        className={`text-xs sm:text-sm ${
                          achievement.achieved
                            ? "text-green-200/70"
                            : "text-green-200/50"
                        }`}
                      >
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}

              {(!user?.achievements || user.achievements.length === 0) && (
                <div className="text-center py-4 sm:py-6 text-green-200/70">
                  <p className="text-sm">Start playing to earn achievements!</p>
                </div>
              )}
            </div>

            <button className="mt-4 sm:mt-6 text-green-300 text-xs sm:text-sm font-medium flex items-center hover:text-green-200 transition-colors">
              View all achievements <ArrowRight size={14} className="ml-1" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 py-4 sm:py-6 border-t border-green-700/30 text-center text-green-200/50 relative z-10 text-xs sm:text-sm">
        <p>
          © 2025 HealthQuest. All rights reserved. Made with ❤️ for healthcare
          education.
        </p>
      </footer>

      {/* Decorative elements */}
      <div className="absolute top-40 left-10 w-32 sm:w-72 h-32 sm:h-72 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-48 sm:w-96 h-48 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
    </div>
  );
}

export default Dashboard;
