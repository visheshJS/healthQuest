import { useState } from 'react';
import { LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { logout } from '../utils/auth';

function LogoutButton({ className = '' }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      logout();
      
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button 
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-colors duration-200 ${className}`}
      aria-label="Logout"
    >
      <LogOutIcon size={18} />
      <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
    </button>
  );
}

export default LogoutButton; 