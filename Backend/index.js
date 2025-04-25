import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import setupSocketIO from "./socket/socketHandler.js";

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

// Set up Socket.IO with CORS
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ["http://localhost:5173"];
console.log('Allowed origins for Socket.IO:', allowedOrigins);

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
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());    
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

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

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERR:",error);
        throw error;
    })
    
    server.listen(process.env.PORT || 5000, ()=>{
        console.log(`server is running at port ${process.env.PORT || 5000}`)
        console.log(`Server is running at http://localhost:${process.env.PORT || 5000}`); // Print localhost URL
        
    });
})
.catch((err)=>{
    console.log("mongo db connection is failed bro !!",err);
});
