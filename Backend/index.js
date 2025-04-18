import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config(
    {
        path:"./.env"
    }
);
import connectDB from "./db/connectDB.js";
const app = express();
const port = process.env.PORT || 3000;
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

})

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());    
app.use(cookieParser());
