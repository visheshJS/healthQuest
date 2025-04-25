/**
 * Avatar utility functions
 */

// Get avatar URL with fallback
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return '/avatars/default.png';
  
  // If it's a full URL, use it
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }
  
  // If it's a path from the server
  if (avatarPath.startsWith('/')) {
    return `https://healthquestgame.onrender.com${avatarPath}`;
  }
  
  // If it's just a filename
  return `/avatars/${avatarPath}`;
};

// Handle avatar loading errors
export const handleAvatarError = (event) => {
  console.log('Avatar loading error, using default');
  if (event.target) {
    event.target.onerror = null; // Prevent infinite loops
    event.target.src = '/avatars/default.png';
  }
};

// Get initials from a username
export const getInitials = (name) => {
  if (!name) return '';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Determine if we should use text or image for avatar
export const shouldUseTextAvatar = (user) => {
  return !user?.avatar || user.avatar === 'default.png'; 
}; 