import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import setupSocketIO from "./socket/socketHandler.js";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(
    {
        path:"./.env"
    }
);
import connectDB from "./db/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

const app = express();
const server = http.createServer(app);

// Set up origins for CORS
const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',')
    : ["http://localhost:5173", "https://healthquestgame.onrender.com"];

console.log('Allowed CORS origins:', allowedOrigins);

// Configure CORS with proper settings
const corsOptions = {
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(null, true); // Allow anyway for now, but log it
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Set up Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Log when a socket connection is established or fails
io.engine.on("connection_error", (err) => {
  console.log('Socket.io connection error:', err.req.url, err.code, err.message, err.context);
});

// Initialize Socket.IO handlers
setupSocketIO(io);

// Middleware
app.use(express.json());    
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files for avatars
app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));

// Create public/avatars directory if it doesn't exist
import fs from 'fs';
const avatarsDir = path.join(__dirname, 'public/avatars');
if (!fs.existsSync(path.join(__dirname, 'public'))) {
    fs.mkdirSync(path.join(__dirname, 'public'));
}
if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir);
    console.log('Created avatars directory:', avatarsDir);
}

// Routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: "Game API is running" });
});

// Add a route specifically for competitive mode
app.get('/competitive-mode', (req, res) => {
    res.json({ message: "Competitive mode server is running" });
});

// Add a route for checking CORS
app.get('/check-cors', (req, res) => {
    res.json({ 
        success: true, 
        message: "CORS is working correctly",
        clientOrigin: req.headers.origin || 'Unknown'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler caught:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong on the server',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERR:",error);
        throw error;
    })
    
    server.listen(process.env.PORT || 5000, ()=>{
        console.log(`Server is running at port ${process.env.PORT || 5000}`);
        console.log(`Server URL: http://localhost:${process.env.PORT || 5000}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'not set'}`);
    });
})
.catch((err)=>{
    console.log("MongoDB connection failed:",err);
});
