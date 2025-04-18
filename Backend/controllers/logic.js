import User from "../models/user.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";    

const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body;
    
    // Validation for required fields
    if (!name || !email || !password) {
        throw new ApiError(400, "Please provide all required fields");
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new ApiError(400, "User already exists");
    }
    
    // Hash the password with salt rounds parameter
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create and save the user - User.create() already saves to database
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword
    });

    console.log("\n✅ New User Registered:");
    console.log({
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        timestamp: new Date().toISOString()
    });
    console.log("------------------------------\n");


    // Remove password before sending response
    const userResponse = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
    };
    
    // Return success response with user data (excluding password)
    const response = new ApiResponse(201, userResponse, "User created successfully");
    res.status(201).json(response);
});

const loginUser = asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(400,"User not found");

    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        throw new ApiError(400,"Invalid password");
    }
    const response = new ApiResponse(200,user,"User logged in successfully");
    res.status(200).json(response);

}); 


export {registerUser, loginUser};


