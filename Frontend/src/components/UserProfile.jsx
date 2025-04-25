import React from 'react';
import { Users } from 'lucide-react';

const UserProfile = ({ user, size = 'md', className = '', onClick }) => {
  // Handle missing user or incomplete user data
  if (!user || (!user.username && !user.avatar)) {
    return (
      <div className={`rounded-full bg-green-500/30 flex items-center justify-center ${className} ${getSize(size)}`} onClick={onClick}>
        <Users className="text-white" size={getSvgSize(size)} />
      </div>
    );
  }
  
  const handleImageError = (e) => {
    console.log('Avatar image failed to load, using fallback');
    e.target.onerror = null; // Prevent infinite loop
    e.target.style.display = 'none'; // Hide the broken image
    e.target.parentNode.classList.add('fallback-avatar');
    
    // Add fallback icon if it doesn't exist
    if (!e.target.parentNode.querySelector('svg')) {
      const icon = document.createElement('div');
      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>';
      icon.className = 'flex items-center justify-center h-full w-full';
      icon.querySelector('svg').setAttribute('width', getSvgSize(size));
      icon.querySelector('svg').setAttribute('height', getSvgSize(size));
      e.target.parentNode.appendChild(icon);
    }
  };

  return (
    <div 
      className={`relative rounded-full overflow-hidden flex items-center justify-center bg-green-500/30 ${className} ${getSize(size)}`}
      onClick={onClick}
    >
      {user.avatar ? (
        <img 
          src={user.avatar.startsWith('http') ? user.avatar : `/avatars/default.png`}
          alt={user.username || 'User'}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <>
          {user.username ? (
            <div className="text-white font-bold text-center">
              {getInitials(user.username)}
            </div>
          ) : (
            <Users className="text-white" size={getSvgSize(size)} />
          )}
        </>
      )}
    </div>
  );
};

// Helper functions
const getSize = (size) => {
  switch (size) {
    case 'xs': return 'w-6 h-6';
    case 'sm': return 'w-8 h-8';
    case 'md': return 'w-10 h-10';
    case 'lg': return 'w-12 h-12';
    case 'xl': return 'w-16 h-16';
    case '2xl': return 'w-20 h-20';
    default: return 'w-10 h-10';
  }
};

const getSvgSize = (size) => {
  switch (size) {
    case 'xs': return 12;
    case 'sm': return 16;
    case 'md': return 20;
    case 'lg': return 24;
    case 'xl': return 32;
    case '2xl': return 40;
    default: return 20;
  }
};

const getInitials = (name) => {
  if (!name) return '';
  
  // Get initials from first and last name
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export default UserProfile; 