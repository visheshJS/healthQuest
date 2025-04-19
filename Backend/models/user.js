import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define a schema for progress tracking
const progressSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: false
    },
    gameType: {
        type: String,
        required: true
    },
    bestScore: {
        type: Number,
        default: 0
    },
    timeSpent: {
        type: Number,
        default: 0
    },
    playCount: {
        type: Number,
        default: 0
    },
    lastPlayed: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

// Define a schema for achievements
const achievementSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: "trophy"
    },
    achieved: {
        type: Boolean,
        default: false
    },
    dateEarned: {
        type: Date
    },
    xpAwarded: {
        type: Number,
        default: 100
    }
}, { _id: false });

// Define schema for recent games
const recentGameSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    xp: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters"]
    },
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email"
        ]
    },
    password: { 
        type: String, 
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"]
    },
    profession: {
        type: String,
        required: [true, "Profession is required"],
        enum: ["doctor", "nurse", "student", "other"]
    },
    avatar: {
        type: String,
        default: "/avatars/default.png"
    },
    level: {
        type: Number,
        default: 1
    },
    xp: {
        type: Number,
        default: 0
    },
    completedQuizzes: {
        type: Number,
        default: 0
    },
    streak: {
        type: Number,
        default: 0
    },
    lastLoginDate: {
        type: Date,
        default: Date.now
    },
    lastPlayed: {
        type: Date
    },
    accuracy: {
        type: Number,
        default: 0
    },
    ranking: {
        type: Number,
        default: 100
    },
    progress: [progressSchema],
    achievements: [achievementSchema],
    recentGames: [recentGameSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRY || '24h' }
    );
};

const User = mongoose.model("User", userSchema);

export default User;
