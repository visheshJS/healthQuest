import User from '../models/user.js';
import jwt from 'jsonwebtoken';

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { username, email, password, profession } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }]
        });
        
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email 
                    ? "Email already in use" 
                    : "Username already taken"
            });
        }
        
        // Choose an avatar based on username (deterministic)
        // This ensures the same username always gets the same avatar
        const animalAvatars = [
            // Bear avatars
            'https://api.dicebear.com/7.x/bottts/svg?seed=bear1&backgroundColor=b6e3f4',
            'https://api.dicebear.com/7.x/bottts/svg?seed=bear2&backgroundColor=d1d4f9',
            
            // Cat avatars
            'https://api.dicebear.com/7.x/bottts/svg?seed=cat1&backgroundColor=c0aede',
            'https://api.dicebear.com/7.x/bottts/svg?seed=cat2&backgroundColor=ffdfbf',
            
            // Dog avatars
            'https://api.dicebear.com/7.x/bottts/svg?seed=dog1&backgroundColor=ffd5dc',
            'https://api.dicebear.com/7.x/bottts/svg?seed=dog2&backgroundColor=c0aede',
            
            // Fox avatars
            'https://api.dicebear.com/7.x/bottts/svg?seed=fox1&backgroundColor=ffdfbf',
            'https://api.dicebear.com/7.x/bottts/svg?seed=fox2&backgroundColor=d1d4f9',
            
            // Rabbit avatars
            'https://api.dicebear.com/7.x/bottts/svg?seed=rabbit1&backgroundColor=b6e3f4',
            'https://api.dicebear.com/7.x/bottts/svg?seed=rabbit2&backgroundColor=ffd5dc',
            
            // Lion avatars
            'https://api.dicebear.com/7.x/bottts/svg?seed=lion1&backgroundColor=d1d4f9',
            'https://api.dicebear.com/7.x/bottts/svg?seed=lion2&backgroundColor=c0aede',

            // Panda avatars
            'https://api.dicebear.com/7.x/bottts/svg?seed=panda1&backgroundColor=b6e3f4',
            'https://api.dicebear.com/7.x/bottts/svg?seed=panda2&backgroundColor=d1d4f9'
        ];
        
        const avatarIndex = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % animalAvatars.length;
        const userAvatar = animalAvatars[avatarIndex];
        
        // Create new user
        const user = new User({
            username,
            email,
            password,
            profession,
            avatar: userAvatar,
            level: 1,
            xp: 0,
            completedQuizzes: 0,
            streak: 0,
            achievements: [
                { 
                    id: 'first_steps', 
                    name: 'First Steps', 
                    description: 'Complete your first quiz', 
                    achieved: false 
                },
                { 
                    id: 'perfect_score', 
                    name: 'Perfect Score', 
                    description: 'Score 100% on any quiz', 
                    achieved: false 
                },
                { 
                    id: 'weekly_streak', 
                    name: 'Weekly Warrior', 
                    description: 'Maintain a 7-day streak', 
                    achieved: false 
                },
                { 
                    id: 'monthly_streak', 
                    name: 'Dedication', 
                    description: 'Maintain a 30-day streak', 
                    achieved: false 
                },
                { 
                    id: 'quiz_master', 
                    name: 'Quiz Master', 
                    description: 'Complete 10 quizzes', 
                    achieved: false 
                },
                { 
                    id: 'no_mistakes', 
                    name: 'Flawless', 
                    description: 'Complete a quiz without losing a life', 
                    achieved: false 
                }
            ],
            recentGames: []
        });
        
        // Save user to database
        await user.save();
        
        // Generate token
        const token = user.generateAuthToken();
        
        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            secure: process.env.NODE_ENV === 'production'
        });
        
        // Prepare user object for response
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            profession: user.profession,
            avatar: user.avatar,
            level: user.level,
            xp: user.xp,
            completedQuizzes: user.completedQuizzes,
            streak: user.streak,
            achievements: user.achievements,
            recentGames: user.recentGames,
            progress: user.progress || []
        };
        
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userResponse,
            token
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message
        });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        
        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        
        // Update last login date
        user.lastLoginDate = new Date();
        
        // Check streak
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const lastLogin = new Date(user.lastLoginDate);
        const currentDate = new Date();
        const daysSinceLastLogin = Math.floor((currentDate - lastLogin) / oneDayInMs);
        
        if (daysSinceLastLogin === 1) {
            // If logged in one day after last login, increment streak
            user.streak += 1;
        } else if (daysSinceLastLogin > 1) {
            // If more than one day, reset streak
            user.streak = 1;
        }
        
        await user.save();
        
        // Generate token
        const token = user.generateAuthToken();
        
        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            secure: process.env.NODE_ENV === 'production'
        });
        
        // Prepare user object for response
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            profession: user.profession,
            avatar: user.avatar,
            level: user.level,
            xp: user.xp,
            completedQuizzes: user.completedQuizzes || 0,
            streak: user.streak || 0,
            lastPlayed: user.lastPlayed,
            accuracy: user.accuracy || 0,
            achievements: user.achievements || [],
            recentGames: user.recentGames || [],
            progress: user.progress || []
        };
        
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: userResponse,
            token
        });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({
            success: false,
            message: "Error logging in",
            error: error.message
        });
    }
};

// Logout user
export const logoutUser = async (req, res) => {
    try {
        // Clear cookie
        res.clearCookie('token');
        
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error("Error logging out:", error);
        return res.status(500).json({
            success: false,
            message: "Error logging out",
            error: error.message
        });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            user
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving user profile",
            error: error.message
        });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, profession } = req.body;
        
        // Check if username is already taken by another user
        if (username) {
            const existingUser = await User.findOne({ 
                username, 
                _id: { $ne: userId } 
            });
            
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Username already taken"
                });
            }
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, profession },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: error.message
        });
    }
};

// Update user progress
export const updateUserProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            xp, 
            level, 
            completedQuizzes, 
            streak, 
            lastPlayed,
            achievements, 
            recentGames 
        } = req.body;
        
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Update user fields
        if (xp !== undefined) user.xp = xp;
        if (level !== undefined) user.level = level;
        if (completedQuizzes !== undefined) user.completedQuizzes = completedQuizzes;
        if (streak !== undefined) user.streak = streak;
        if (lastPlayed !== undefined) user.lastPlayed = new Date(lastPlayed);
        
        // Update achievements if provided
        if (achievements && Array.isArray(achievements)) {
            // For now we'll just replace achievements with the new array
            // A more sophisticated approach would merge existing and new achievements
            user.achievements = achievements.map(achievement => ({
                id: achievement.id,
                name: achievement.name,
                description: achievement.description,
                icon: achievement.icon || "trophy",
                dateEarned: achievement.dateEarned || new Date(),
                xpAwarded: achievement.xpAwarded || 100,
                achieved: achievement.achieved
            }));
        }
        
        // Update recent games if provided
        if (recentGames && recentGames.length > 0) {
            // Store most recent game in progress array
            const latestGame = recentGames[0];
            
            // Add to user's progress if it's a new game type
            // This is a simplified approach - in a real app, you might want to use actual game IDs
            const gameType = latestGame.type;
            
            let progressEntry = user.progress.find(p => p.gameType === gameType);
            
            if (!progressEntry) {
                // Create a new progress entry if this game type doesn't exist
                user.progress.push({
                    gameType: gameType,
                    bestScore: latestGame.score,
                    playCount: 1,
                    lastPlayed: new Date()
                });
            } else {
                // Update existing progress entry
                progressEntry.playCount += 1;
                progressEntry.lastPlayed = new Date();
                if (latestGame.score > progressEntry.bestScore) {
                    progressEntry.bestScore = latestGame.score;
                }
            }
            
            // Explicitly update the recentGames array
            user.recentGames = recentGames.map(game => ({
                id: game.id.toString(),
                type: game.type,
                score: game.score,
                xp: game.xp,
                timestamp: new Date(game.timestamp || Date.now())
            }));
            
            // Calculate overall accuracy if data is available
            if (user.completedQuizzes > 0) {
                // This is a simplified calculation - adapt based on your actual data model
                const totalGames = user.progress.reduce((sum, game) => sum + game.playCount, 0);
                const totalScore = user.progress.reduce((sum, game) => sum + (game.bestScore * game.playCount), 0);
                user.accuracy = totalScore / totalGames;
            }
        }
        
        // Save the updated user
        await user.save();
        
        return res.status(200).json({
            success: true,
            message: "User progress updated successfully",
            user: {
                id: user._id,
                username: user.username,
                avatar: user.avatar,
                level: user.level,
                xp: user.xp,
                completedQuizzes: user.completedQuizzes,
                streak: user.streak,
                accuracy: user.accuracy
            }
        });
    } catch (error) {
        console.error("Error updating user progress:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating user progress",
            error: error.message
        });
    }
}; 