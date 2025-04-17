import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../components/Layout'
import { 
  Search, 
  Brain, 
  Heart, 
  Microscope, 
  PlusCircle, 
  ArrowUpDown, 
  Star,
  Clock,
  BookOpenText,
  Shield,
  Stethoscope,
  BadgePlus,
  Beaker,
  Pill,
  Trophy,
  Dna
} from 'lucide-react'

function Games() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  
  const categories = [
    { id: 'all', name: 'All Games', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'anatomy', name: 'Anatomy', icon: <Heart className="w-4 h-4" /> },
    { id: 'diagnosis', name: 'Diagnosis', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'emergency', name: 'Emergency', icon: <Shield className="w-4 h-4" /> },
    { id: 'pharma', name: 'Pharmacology', icon: <Pill className="w-4 h-4" /> },
    { id: 'lab', name: 'Laboratory', icon: <Microscope className="w-4 h-4" /> },
    { id: 'bio', name: 'Biology', icon: <Dna className="w-4 h-4" /> }
  ]
  
  const games = [
    {
      id: 1,
      title: 'Anatomy Explorer',
      description: 'Navigate through 3D models of the human body and identify structures',
      category: 'anatomy',
      difficulty: 'Medium',
      time: '10-15 min',
      played: 3420,
      rating: 4.8,
      image: <Heart className="w-12 h-12 text-green-300" />,
      color: 'from-green-500 to-emerald-400'
    },
    {
      id: 2,
      title: 'Diagnosis Detective',
      description: 'Analyze symptoms and patient histories to solve medical mysteries',
      category: 'diagnosis',
      difficulty: 'Hard',
      time: '15-20 min',
      played: 2890,
      rating: 4.7,
      image: <Stethoscope className="w-12 h-12 text-green-300" />,
      color: 'from-emerald-500 to-teal-400'
    },
    {
      id: 3,
      title: 'Emergency Responder',
      description: 'Test your clinical decision-making in emergency scenarios',
      category: 'emergency',
      difficulty: 'Expert',
      time: '20-30 min',
      played: 1970,
      rating: 4.9,
      image: <Shield className="w-12 h-12 text-green-300" />,
      color: 'from-teal-500 to-cyan-400'
    },
    {
      id: 4,
      title: 'Pharmacology Challenge',
      description: 'Match medications to conditions and identify drug interactions',
      category: 'pharma',
      difficulty: 'Medium',
      time: '10-15 min',
      played: 2340,
      rating: 4.5,
      image: <Pill className="w-12 h-12 text-green-300" />,
      color: 'from-cyan-500 to-blue-400'
    },
    {
      id: 5,
      title: 'Lab Technician',
      description: 'Interpret lab results and identify abnormalities',
      category: 'lab',
      difficulty: 'Hard',
      time: '15-20 min',
      played: 1850,
      rating: 4.6,
      image: <Beaker className="w-12 h-12 text-green-300" />,
      color: 'from-indigo-500 to-purple-400'
    },
    {
      id: 6,
      title: 'Medical Terminology',
      description: 'Speed-based quiz on medical terms and definitions',
      category: 'diagnosis',
      difficulty: 'Easy',
      time: '5-10 min',
      played: 3970,
      rating: 4.4,
      image: <BookOpenText className="w-12 h-12 text-green-300" />,
      color: 'from-purple-500 to-pink-400'
    },
    {
      id: 7,
      title: 'Cellular Pathways',
      description: 'Explore and interact with cellular mechanisms and pathways',
      category: 'bio',
      difficulty: 'Hard',
      time: '15-20 min',
      played: 1580,
      rating: 4.8,
      image: <Dna className="w-12 h-12 text-green-300" />,
      color: 'from-green-500 to-teal-400'
    },
    {
      id: 8,
      title: 'Surgical Simulator',
      description: 'Practice surgical procedures in a virtual environment',
      category: 'emergency',
      difficulty: 'Expert',
      time: '25-30 min',
      played: 1240,
      rating: 4.9,
      image: <BadgePlus className="w-12 h-12 text-green-300" />,
      color: 'from-red-500 to-orange-400'
    }
  ]
  
  // Filter and sort games
  const filteredGames = games
    .filter(game => 
      (filterCategory === 'all' || game.category === filterCategory) &&
      (game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       game.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'popular') return b.played - a.played
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'newest') return b.id - a.id
      return 0
    })

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-russo text-green-300 mb-2">Game Library</h1>
        <p className="text-white/70">Explore our collection of medical games to enhance your knowledge</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search games..."
            className="w-full px-10 py-3 bg-black/30 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400/70 w-5 h-5" />
        </div>

        <div className="flex gap-3">
          <select
            className="px-4 py-3 bg-black/30 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
              filterCategory === category.id 
              ? 'bg-green-500 text-white' 
              : 'bg-black/30 border border-green-500/30 text-white/70 hover:bg-black/50'
            }`}
            onClick={() => setFilterCategory(category.id)}
          >
            {category.icon}
            <span className="text-sm">{category.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.map(game => (
          <div key={game.id} className="group bg-black/30 border border-green-500/20 rounded-xl overflow-hidden hover:border-green-500/50 transition-all">
            <div className={`h-32 bg-gradient-to-r ${game.color} flex items-center justify-center`}>
              {game.image}
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-green-200">{game.title}</h3>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-green-400/80 fill-current mr-1" />
                  <span className="text-sm text-white/80">{game.rating}</span>
                </div>
              </div>
              
              <p className="text-white/70 text-sm mb-4">{game.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs py-1 px-2 bg-black/40 rounded text-white/60">{game.difficulty}</span>
                <span className="text-xs py-1 px-2 bg-black/40 rounded text-white/60 flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> {game.time}
                </span>
                <span className="text-xs py-1 px-2 bg-black/40 rounded text-white/60 flex items-center">
                  <Trophy className="w-3 h-3 mr-1" /> {game.played.toLocaleString()} plays
                </span>
              </div>
              
              <button className="w-full py-2 game-button text-sm">
                Play Game
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredGames.length === 0 && (
        <div className="text-center p-10 bg-black/20 rounded-xl border border-green-500/20">
          <Brain className="w-12 h-12 text-green-400/50 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No games found</h3>
          <p className="text-white/70">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Games 