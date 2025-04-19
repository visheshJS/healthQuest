import axios from 'axios';

// API base URL
const API_URL = 'https://healthquest-n0i2.onrender.com/api';

// Create a custom axios instance for API calls
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: false, // Set to false since we're using token auth
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Set auth token for all requests
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Also set it on the global axios for any non-apiClient requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/users/login', credentials);
    
    if (response.data.success) {
      // Save to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Set auth token for future requests
      setAuthToken(response.data.token);
      
      return { success: true, data: response.data };
    }
    
    return { success: false, message: 'Login failed' };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Login failed. Please try again.' 
    };
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/users/register', userData);
    
    if (response.data.success) {
      // Save to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Set auth token for future requests
      setAuthToken(response.data.token);
      
      return { success: true, data: response.data };
    }
    
    return { success: false, message: 'Registration failed' };
  } catch (error) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Registration failed. Please try again.' 
    };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    // Call logout API
    await apiClient.post('/users/logout');
    
    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear auth header
    setAuthToken(null);
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if API call fails, clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear auth header
    setAuthToken(null);
    
    return { success: true };
  }
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = getCurrentUser();
  return !!token && !!user;
};

// Initialize auth state
export const initAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }
};

// Update user XP and track completed quizzes
export const updateUserProgress = async (quizData) => {
  try {
    // Get current user
    const user = getCurrentUser();
    if (!user) return false;
    
    // Update XP based on score
    const earnedXP = calculateXP(quizData.score, quizData.difficulty);
    const newXP = (user.xp || 0) + earnedXP;
    
    // Calculate level based on XP
    const newLevel = calculateLevel(newXP);
    
    // Update completed quizzes count
    const completedQuizzes = (user.completedQuizzes || 0) + 1;
    
    // Update user streak if needed
    let streak = user.streak || 0;
    const lastPlayed = user.lastPlayed ? new Date(user.lastPlayed) : null;
    const today = new Date();
    
    // Check if the last played date was yesterday
    if (lastPlayed) {
      const timeDiff = today.getTime() - lastPlayed.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      
      if (daysDiff === 1) {
        // Increase streak if last played was yesterday
        streak += 1;
      } else if (daysDiff > 1) {
        // Reset streak if more than a day was missed
        streak = 1;
      }
      // If played on the same day, streak remains unchanged
    } else {
      // First time playing
      streak = 1;
    }
    
    // Update achievements
    const achievements = updateAchievements(user, quizData, streak, completedQuizzes);
    
    // Save activity to recent games
    const recentActivity = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: quizData.type,
      score: quizData.score,
      xp: earnedXP,
      timestamp: new Date()
    };
    
    const recentGames = user.recentGames || [];
    // Add to beginning and limit to 10 entries
    recentGames.unshift(recentActivity);
    if (recentGames.length > 10) {
      recentGames.pop();
    }
    
    // Update user object
    const updatedUser = {
      ...user,
      xp: newXP,
      level: newLevel,
      completedQuizzes,
      streak,
      lastPlayed: today,
      achievements,
      recentGames
    };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update user data on the server
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found, cannot update user data on server');
      } else {
        // Send updated user data to the server
        const response = await apiClient.put('/users/update-progress', {
          xp: newXP,
          level: newLevel,
          completedQuizzes,
          streak,
          lastPlayed: today,
          achievements,
          recentGames: [recentActivity, ...recentGames.slice(0, 9)].map(game => ({
            ...game,
            id: typeof game.id === 'string' ? game.id : `${game.id}-${Math.random().toString(36).substr(2, 9)}`
          }))
        });
        
        if (response.data.success) {
          console.log('User progress updated on server:', response.data);
        } else {
          console.error('Failed to update user progress on server:', response.data);
        }
      }
    } catch (error) {
      console.error('Error updating user progress on server:', error);
      // Continue with local updates even if server update fails
    }
    
    return { 
      success: true, 
      user: updatedUser, 
      earnedXP,
      newLevel: newLevel > user.level,
      newAchievements: achievements.filter(a => !a.achieved && a.newlyAchieved)
    };
  } catch (error) {
    console.error('Error updating user progress:', error);
    return { success: false };
  }
};

// Calculate XP based on score and difficulty
const calculateXP = (score, difficulty) => {
  const baseXP = Math.round(score / 10);
  const difficultyMultiplier = 
    difficulty === 'easy' ? 1 :
    difficulty === 'medium' ? 1.5 :
    difficulty === 'hard' ? 2 : 1;
    
  return Math.round(baseXP * difficultyMultiplier);
};

// Calculate level based on XP
const calculateLevel = (xp) => {
  // Level 1: 0-999 XP
  // Level 2: 1000-2499 XP
  // Level 3: 2500-4999 XP
  // Level 4: 5000-7999 XP
  // Level 5: 8000+ XP
  if (xp < 1000) return 1;
  if (xp < 2500) return 2;
  if (xp < 5000) return 3;
  if (xp < 8000) return 4;
  return 5;
};

// Update achievements based on quiz results
const updateAchievements = (user, quizData, streak, completedQuizzes) => {
  const achievements = user.achievements || [
    { id: 'first_steps', name: 'First Steps', description: 'Complete your first quiz', achieved: false, newlyAchieved: false },
    { id: 'perfect_score', name: 'Perfect Score', description: 'Score 100% on any quiz', achieved: false, newlyAchieved: false },
    { id: 'weekly_streak', name: 'Weekly Warrior', description: 'Maintain a 7-day streak', achieved: false, newlyAchieved: false },
    { id: 'monthly_streak', name: 'Dedication', description: 'Maintain a 30-day streak', achieved: false, newlyAchieved: false },
    { id: 'quiz_master', name: 'Quiz Master', description: 'Complete 10 quizzes', achieved: false, newlyAchieved: false },
    { id: 'no_mistakes', name: 'Flawless', description: 'Complete a quiz without losing a life', achieved: false, newlyAchieved: false }
  ];
  
  // Create a copy of achievements to modify
  const updatedAchievements = [...achievements];
  
  // Check and update achievements
  updatedAchievements.forEach(achievement => {
    // Reset newlyAchieved flag
    achievement.newlyAchieved = false;
    
    // Skip if already achieved
    if (achievement.achieved) return;
    
    // Check each achievement condition
    switch (achievement.id) {
      case 'first_steps':
        if (completedQuizzes >= 1) {
          achievement.achieved = true;
          achievement.newlyAchieved = true;
        }
        break;
        
      case 'perfect_score':
        if (quizData.score === 100) {
          achievement.achieved = true;
          achievement.newlyAchieved = true;
        }
        break;
        
      case 'weekly_streak':
        if (streak >= 7) {
          achievement.achieved = true;
          achievement.newlyAchieved = true;
        }
        break;
        
      case 'monthly_streak':
        if (streak >= 30) {
          achievement.achieved = true;
          achievement.newlyAchieved = true;
        }
        break;
        
      case 'quiz_master':
        if (completedQuizzes >= 10) {
          achievement.achieved = true;
          achievement.newlyAchieved = true;
        }
        break;
        
      case 'no_mistakes':
        if (quizData.noMistakes) {
          achievement.achieved = true;
          achievement.newlyAchieved = true;
        }
        break;
        
      default:
        break;
    }
  });
  
  return updatedAchievements;
}; 