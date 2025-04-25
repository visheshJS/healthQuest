import axios from 'axios';

// Get API URL from environment or use the deployment URL
const API_URL = import.meta.env.VITE_API_URL || 'https://healthquest-n0i2.onrender.com';
console.log('Using API URL:', API_URL);

// Configure axios instance with the correct base URL
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enable credentials for auth requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to log all outgoing requests (for debugging)
api.interceptors.request.use(
  config => {
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Initialize authentication state
export const initAuth = () => {
  console.log('Initializing auth state');
  // Check if token exists but has expired
  const token = localStorage.getItem('token');
  if (token) {
    console.log('Auth token found in localStorage');
    
    // We could validate the token here if needed
    // For now, we'll just make sure the API is configured properly
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    console.log('No auth token found in localStorage');
  }
};

// Handle login
export const login = async (email, password) => {
  try {
    // Add detailed logs to help debug the issue
    console.log('Login attempt with:', { email, apiUrl: API_URL });
    
    // Ensure we're using the full URL with /api path included
    const fullUrl = `${API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`}/users/login`;
    console.log('Making request to full URL:', fullUrl);
    
    const response = await axios.post(fullUrl, { email, password }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Login response:', response.data);
    
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user._id || response.data.user.id);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error details:', error);
    console.error('Login error response:', error.response?.data);
    console.error('Login error status:', error.response?.status);
    throw error;
  }
};

// Handle registration
export const register = async (userData) => {
  try {
    // Add detailed logs to help debug the issue
    console.log('Registration attempt with:', { email: userData.email, apiUrl: API_URL });
    
    // Ensure we're using the full URL with /api path included
    const fullUrl = `${API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`}/users/register`;
    console.log('Making request to full URL:', fullUrl);
    
    const response = await axios.post(fullUrl, userData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Registration response:', response.data);
    
    // If the registration is successful and returns a token, store it same as login
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user._id || response.data.user.id);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error details:', error);
    console.error('Registration error response:', error.response?.data);
    console.error('Registration error status:', error.response?.status);
    throw error;
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
    return null;
  }
};

// Get JWT token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Update user progress
export const updateUserProgress = async (progressData) => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return { success: false, message: 'User not authenticated' };
    }
    
    // Get current user data
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.error('User data not found in localStorage');
      return { success: false, message: 'User data not available' };
    }
    
    // Calculate earned XP based on score/performance
    const earnedXP = progressData.earnedXP || Math.max(5, Math.floor(progressData.score / 10));
    
    // Handle achievements
    const existingAchievements = currentUser.achievements || [];
    const updatedAchievements = [...existingAchievements];
    const newAchievements = [];
    
    // Check for achievements based on the game data
    if (progressData.score >= 80) {
      // "High Score" achievement
      const highScoreAchievement = updatedAchievements.find(a => a.id === 'high_score');
      if (highScoreAchievement && !highScoreAchievement.achieved) {
        highScoreAchievement.achieved = true;
        highScoreAchievement.dateEarned = new Date().toISOString();
        newAchievements.push(highScoreAchievement);
      }
    }
    
    if (progressData.noMistakes) {
      // "Flawless" achievement - Complete a quiz without losing a life
      const flawlessAchievement = updatedAchievements.find(a => a.id === 'no_mistakes');
      if (flawlessAchievement && !flawlessAchievement.achieved) {
        flawlessAchievement.achieved = true;
        flawlessAchievement.dateEarned = new Date().toISOString();
        newAchievements.push(flawlessAchievement);
      }
    }
    
    // "First Steps" achievement - Complete your first quiz
    const firstStepsAchievement = updatedAchievements.find(a => a.id === 'first_steps');
    if (firstStepsAchievement && !firstStepsAchievement.achieved) {
      firstStepsAchievement.achieved = true;
      firstStepsAchievement.dateEarned = new Date().toISOString();
      newAchievements.push(firstStepsAchievement);
    }
    
    // Check for Quiz Master achievement - Complete 10 quizzes
    if ((currentUser.completedQuizzes || 0) + 1 >= 10) {
      const quizMasterAchievement = updatedAchievements.find(a => a.id === 'quiz_master');
      if (quizMasterAchievement && !quizMasterAchievement.achieved) {
        quizMasterAchievement.achieved = true;
        quizMasterAchievement.dateEarned = new Date().toISOString();
        newAchievements.push(quizMasterAchievement);
      }
    }
    
    // Check for streak achievements
    let currentStreak = currentUser.streak || 0;
    const lastPlayed = currentUser.lastPlayed ? new Date(currentUser.lastPlayed) : null;
    const today = new Date();
    
    // If last played was yesterday, increment streak
    if (lastPlayed) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastPlayed.toDateString() === yesterday.toDateString()) {
        currentStreak += 1;
      } else if (lastPlayed.toDateString() !== today.toDateString()) {
        // If not played yesterday or today, reset streak
        currentStreak = 1;
      }
    } else {
      // First time playing
      currentStreak = 1;
    }
    
    // Weekly streak achievement
    if (currentStreak >= 7) {
      const weeklyStreakAchievement = updatedAchievements.find(a => a.id === 'weekly_streak');
      if (weeklyStreakAchievement && !weeklyStreakAchievement.achieved) {
        weeklyStreakAchievement.achieved = true;
        weeklyStreakAchievement.dateEarned = new Date().toISOString();
        newAchievements.push(weeklyStreakAchievement);
      }
    }
    
    // Monthly streak achievement
    if (currentStreak >= 30) {
      const monthlyStreakAchievement = updatedAchievements.find(a => a.id === 'monthly_streak');
      if (monthlyStreakAchievement && !monthlyStreakAchievement.achieved) {
        monthlyStreakAchievement.achieved = true;
        monthlyStreakAchievement.dateEarned = new Date().toISOString();
        newAchievements.push(monthlyStreakAchievement);
      }
    }
    
    // Prepare the recent game data
    const newGame = {
      id: Date.now().toString(),
      type: progressData.type,
      score: progressData.score,
      difficulty: progressData.difficulty || 'medium',
      questionsAttempted: progressData.questionsAttempted || 10,
      correctAnswers: progressData.correctAnswers || Math.floor(progressData.score / 10),
      xp: earnedXP,
      timestamp: new Date().toISOString()
    };
    
    // Get existing recent games and add new one at the beginning
    const existingGames = currentUser.recentGames || [];
    const updatedGames = [newGame, ...existingGames].slice(0, 10); // Keep only most recent 10 games
    
    // Prepare data to send to the server
    const updatedUserData = {
      xp: currentUser.xp + earnedXP,
      completedQuizzes: (currentUser.completedQuizzes || 0) + 1,
      streak: currentStreak,
      lastPlayed: new Date().toISOString(),
      achievements: updatedAchievements,
      recentGames: updatedGames
    };
    
    console.log('Updating user progress with:', updatedUserData);
    
    // Ensure we're using the full URL with /api path included
    const fullUrl = `${API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`}/users/update-progress`;
    console.log('Making user progress request to:', fullUrl);
    
    const token = getToken();
    const response = await axios.put(fullUrl, updatedUserData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    
    console.log('Progress update response:', response.data);
    
    // Update the user in localStorage with the updated data
    if (response.data && response.data.user) {
      // Create a complete updated user object by merging current data with response
      const updatedUser = { 
        ...currentUser, 
        ...response.data.user,
        // Make sure these specific arrays are updated
        achievements: updatedAchievements,
        recentGames: updatedGames
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Return the updated data with earned XP and new achievements
      return {
        success: true,
        earnedXP: earnedXP,
        user: updatedUser,
        newAchievements: newAchievements.length > 0 ? newAchievements : null,
        message: 'Progress updated successfully'
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating user progress:', error);
    console.error('Error response:', error.response?.data);
    
    // For now, simulate a successful update for offline play
    // This allows the game to continue even if the server is unreachable
    const currentUser = getCurrentUser();
    if (currentUser) {
      const earnedXP = progressData.earnedXP || Math.floor(Math.random() * 20) + 5;
      
      // Create a new recent game entry
      const newGame = {
        id: Date.now().toString(),
        type: progressData.type,
        score: progressData.score || 0,
        difficulty: progressData.difficulty || 'medium',
        xp: earnedXP,
        timestamp: new Date().toISOString()
      };
      
      // Add to recent games
      const existingGames = currentUser.recentGames || [];
      const updatedGames = [newGame, ...existingGames].slice(0, 10);
      
      // Update local user data even in offline mode
      const updatedUser = {
        ...currentUser,
        xp: currentUser.xp + earnedXP,
        completedQuizzes: (currentUser.completedQuizzes || 0) + 1,
        recentGames: updatedGames
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { 
        success: true, 
        earnedXP: earnedXP,
        user: updatedUser,
        message: 'Progress updated in offline mode'
      };
    }
    
    return { 
      success: false, 
      message: 'Failed to update progress'
    };
  }
};

// Set authorization header for authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; 