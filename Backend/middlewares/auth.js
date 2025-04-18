import User from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

const auth = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if(!token) {
            throw new ApiError(401, "Please login to access this resource");
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded?._id).select("-password");
        
        if(!user) {
            throw new ApiError(401, "Invalid access token");
        }
    
        req.user = user;
        next();

    } catch(error) {
        // More specific error handling
        throw new ApiError(401, error?.message || "Invalid authentication token");
    }
});

export { auth };
