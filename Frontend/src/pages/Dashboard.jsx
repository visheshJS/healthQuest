import { Link } from 'react-router-dom'
import { DashboardLayout } from '../components/Layout'
import { 
  Trophy, 
  BarChart2, 
  Clock, 
  Brain, 
  Flame,
  BookOpen,
  Award,
  Zap,
  Gamepad,
  CalendarDays,
  Star
} from 'lucide-react'

function Dashboard() {
  const userStats = {
    level: 12,
    experience: 2450,
    nextLevel: 3000,
    completedQuizzes: 34,
    ranking: 87,
    streak: 7,
    accuracy: 78
  }

  const recentActivities = [
    { id: 1, type: 'quiz', name: 'Cardiac Anatomy', score: '92%', date: '2 hours ago' },
    { id: 2, type: 'challenge', name: 'Emergency Triage', score: '85%', date: 'Yesterday' },
    { id: 3, type: 'quiz', name: 'Neurological Disorders', score: '78%', date: '3 days ago' }
  ]

  const recommendedGames = [
    { 
      id: 1, 
      title: 'Diagnosis Detective', 
      description: 'Solve medical mysteries by analyzing symptoms',
      difficulty: 'Medium',
      icon: <Brain className="h-10 w-10 text-green-300" />,
      color: 'from-emerald-500 to-green-400'
    },
    { 
      id: 2, 
      title: 'Surgical Simulator', 
      description: 'Test your surgical knowledge and decision-making',
      difficulty: 'Hard',
      icon: <Zap className="h-10 w-10 text-green-300" />,
      color: 'from-green-500 to-cyan-400'
    },
    { 
      id: 3, 
      title: 'Anatomy Explorer', 
      description: 'Interactive challenges to test your anatomy knowledge',
      difficulty: 'Easy',
      icon: <BookOpen className="h-10 w-10 text-green-300" />,
      color: 'from-teal-500 to-emerald-400'
    }
  ]

  const progressPercentage = (userStats.experience / userStats.nextLevel) * 100

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-green-500/20">
            <h2 className="text-2xl font-russo mb-6 text-green-300">Welcome Back, Dr. Smith!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-black/20 p-4 rounded-lg border border-green-500/10 flex items-center">
                <div className="rounded-full w-12 h-12 bg-green-500/20 flex items-center justify-center mr-4">
                  <Flame className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Current Streak</p>
                  <p className="text-xl font-bold text-white">{userStats.streak} days</p>
                </div>
              </div>
              
              <div className="bg-black/20 p-4 rounded-lg border border-green-500/10 flex items-center">
                <div className="rounded-full w-12 h-12 bg-green-500/20 flex items-center justify-center mr-4">
                  <Award className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Accuracy</p>
                  <p className="text-xl font-bold text-white">{userStats.accuracy}%</p>
                </div>
              </div>
              
              <div className="bg-black/20 p-4 rounded-lg border border-green-500/10 flex items-center">
                <div className="rounded-full w-12 h-12 bg-green-500/20 flex items-center justify-center mr-4">
                  <BookOpen className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Completed</p>
                  <p className="text-xl font-bold text-white">{userStats.completedQuizzes} quizzes</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="mb-2 flex justify-between">
                  <p className="text-sm text-white/70">Level {userStats.level}</p>
                  <p className="text-sm text-white/70">{userStats.experience}/{userStats.nextLevel} XP</p>
                </div>
                <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-2 text-white/50">{Math.round(userStats.nextLevel - userStats.experience)} XP to Level {userStats.level + 1}</p>
              </div>
              
              <div className="flex-1 flex items-center justify-between bg-black/20 p-4 rounded-lg border border-green-500/10">
                <div>
                  <p className="text-white/70 text-sm">Global Ranking</p>
                  <p className="text-xl font-bold text-white">Top {userStats.ranking}%</p>
                </div>
                <div className="rounded-full w-12 h-12 bg-green-500/20 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-green-500/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-russo text-green-300">Recent Activity</h2>
              <button className="text-green-300 text-sm hover:text-green-200">View All</button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="bg-black/20 p-4 rounded-lg border border-green-500/10 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="rounded-full w-10 h-10 bg-green-500/20 flex items-center justify-center mr-4">
                      {activity.type === 'quiz' ? 
                        <Brain className="h-5 w-5 text-green-400" /> : 
                        <Zap className="h-5 w-5 text-green-400" />
                      }
                    </div>
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      <p className="text-sm text-white/60">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-300">{activity.score}</p>
                    <p className="text-xs uppercase text-white/60">{activity.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <div className="p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-green-500/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-russo text-green-300">Recommended Games</h2>
              <Link to="/games" className="text-green-300 text-sm hover:text-green-200">View All</Link>
            </div>
            
            <div className="space-y-4">
              {recommendedGames.map(game => (
                <div key={game.id} className="bg-black/20 p-4 rounded-lg border border-green-500/10">
                  <div className="flex items-start mb-3">
                    <div className={`rounded-xl w-14 h-14 bg-gradient-to-r ${game.color} flex items-center justify-center mr-4 shrink-0`}>
                      {game.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-green-200">{game.title}</h3>
                      <p className="text-sm text-white/70 mb-2">{game.description}</p>
                      <div className="flex items-center text-xs text-white/60">
                        <span className="bg-black/30 px-2 py-1 rounded">
                          {game.difficulty}
                        </span>
                        <div className="ml-2 flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-green-400/60" fill="currentColor" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-2 px-4 bg-green-500/20 hover:bg-green-500/30 rounded text-green-300 transition-colors text-sm">
                    Start Game
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-green-500/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-russo text-green-300">Upcoming Challenges</h2>
              <CalendarDays className="h-5 w-5 text-green-300" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-black/20 rounded-lg border border-green-500/10">
                <div className="rounded-full w-10 h-10 bg-green-500/20 flex items-center justify-center mr-3">
                  <Trophy className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Weekly Tournament</p>
                  <p className="text-xs text-white/60">Starts in 2 days</p>
                </div>
                <button className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 py-1 px-3 rounded">
                  Join
                </button>
              </div>
              
              <div className="flex items-center p-3 bg-black/20 rounded-lg border border-green-500/10">
                <div className="rounded-full w-10 h-10 bg-green-500/20 flex items-center justify-center mr-3">
                  <Gamepad className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Team Challenge</p>
                  <p className="text-xs text-white/60">Starts in 5 days</p>
                </div>
                <button className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 py-1 px-3 rounded">
                  Join
                </button>
              </div>
              
              <div className="flex items-center p-3 bg-black/20 rounded-lg border border-green-500/10">
                <div className="rounded-full w-10 h-10 bg-green-500/20 flex items-center justify-center mr-3">
                  <Clock className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Timed Quiz Marathon</p>
                  <p className="text-xs text-white/60">Starts in 1 week</p>
                </div>
                <button className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 py-1 px-3 rounded">
                  Remind
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard 