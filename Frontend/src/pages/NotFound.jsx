import { Link } from 'react-router-dom';
import { Particles } from '../components/particles';

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 text-white relative overflow-hidden flex flex-col items-center justify-center">
      <Particles className="absolute inset-0 z-0" quantity={30} />
      
      <div className="relative z-10 container mx-auto px-4 py-16 text-center">
        <h1 className="text-9xl font-bold text-green-300 mb-4">404</h1>
        <h2 className="text-4xl font-russo mb-8">Page Not Found</h2>
        <p className="text-xl mb-8 max-w-xl mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link 
          to="/" 
          className="game-button px-8 py-3 text-lg inline-flex items-center"
        >
          Return to Home
        </Link>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
    </div>
  );
}

export default NotFound; 