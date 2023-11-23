import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res, next) => {

    //get Data from frontend
    //validation --not empty
    //check if user already exits
    //check for images ,check for avatar
    //upload them to cloudinary, avatar
    //create user object -create entry in db
    //
    const { username, fullName, email, password } = req.body;
    if ([username, fullName, email, password].some(field => field === undefined || field?.trim() === "")) {
        throw new ApiError(400, "All field are required !!");
    }

    const existedUser = await User.findOne({ $or: [{ email }, { email }] });
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }
    // * TODO: observe req.files for studying purpose
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;;
    }
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log(avatar);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new ApiError(500, "Error while uploading avatar");
    }

    const user = await User.create({
        username,
        fullName,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    });
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Error while creating user");
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered Successfully !!! "));
});

export {
    registerUser
}