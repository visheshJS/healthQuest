// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://healthquestgame.onrender.com',
  API_PATH: '/api',
  AVATARS_PATH: '/avatars'
};

// Helper functions for API URLs
export const getApiUrl = (path = '') => `${API_CONFIG.BASE_URL}${API_CONFIG.API_PATH}${path}`;

// Helper for avatar URLs
export const getAvatarUrl = (filename = 'default.png') => {
  // If it's already a full URL or an absolute path
  if (filename && (filename.startsWith('http') || filename.startsWith('/'))) {
    return filename;
  }
  
  // For avatars from the API server
  if (filename) {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.AVATARS_PATH}/${filename}`;
  }
  
  // Default avatar from the public folder
  return '/avatars/default.png';
};

// Handle avatar loading errors
export const handleAvatarError = (event) => {
  if (event.target) {
    console.log('Avatar loading error, using default');
    event.target.src = '/avatars/default.png';
  }
};

export default API_CONFIG; 