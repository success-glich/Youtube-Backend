import vars from "../config/vars";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {

        const accessToken = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "");

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