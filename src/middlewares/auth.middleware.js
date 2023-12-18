import vars from "../config/vars.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const isAuthenticated = asyncHandler(async (req, _, next) => {
    try {

        const accessToken = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "");
        console.log(accessToken);
        if (!accessToken) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(accessToken, vars.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select('-password -refreshToken');

        if (!user) {
            // TODO: learn about frontend
            throw new ApiError(401, 'Invalid Access Token');
        }

        req.user = user;
        next();
    } catch (err) {

        throw new ApiError(401, 'Invalid Access token');


    }
});