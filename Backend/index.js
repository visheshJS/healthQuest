import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mongoose from "mongoose";

dotenv.config(
    {
        path:"./.env"
    }
);
import connectDB from "./db/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

const app = express();
const port = process.env.PORT || 5000;
import compression from 'compression';

// Add before other middleware
app.use(compression());
import helmet from 'helmet';

// Add before other middleware
app.use(helmet());



// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN 
    : [process.env.CORS_ORIGIN, 'http://localhost:5174', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
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

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERR:",error);
        throw error;
    })
    
    app.listen(port, ()=>{
        console.log(`server is running at port ${port}`)
        console.log(`Server is running at http://localhost:${port}`); // Print localhost URL
        
    });
})
.catch((err)=>{
    console.log("mongo db connection is failed bro !!",err);
});
