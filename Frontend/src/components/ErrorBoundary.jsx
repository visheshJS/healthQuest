import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-green-700/40">
            <div className="text-center mb-6">
              <AlertCircle className="inline-block text-red-400 mb-3" size={48} />
              <h1 className="text-2xl font-bold text-green-300 mb-2">Something went wrong</h1>
              <p className="text-green-100/70 mb-4">
                We're sorry, but an error occurred while trying to load this page.
              </p>
              <div className="bg-black/30 p-3 rounded-lg text-left overflow-auto max-h-32 mb-4">
                <p className="text-sm text-red-300 font-mono">
                  {this.state.error && this.state.error.toString()}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 bg-green-600/30 hover:bg-green-600/50 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
              
              <Link 
                to="/dashboard" 
                className="w-full py-2 px-4 bg-green-700/20 hover:bg-green-700/40 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Home size={16} />
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 