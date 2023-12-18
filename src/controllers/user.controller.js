import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import vars from "../config/vars.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); //validateBeforeSave 

        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(500, "Something went wrong while generating refresh and accessToken")
    }

}

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
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }
    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;;
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

const loginUser = asyncHandler(async (req, res, next) => {
    // * TODO: 
    /*
        1) get username and password from user as input 
        2)check if user exist
        3) check whether the password is correct
        4) if password is correct, generate accessToken and refreshToken
        5) send cookie
        5) save refresh token in db
        6) send user data without password and refreshToken
         and accessToken
    */

    const { username, email, password } = req.body;
    console.log(username, email, password);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    // if (!username || !email) {
    //     throw new ApiError(400, "Username or email is required!!");
    // }
    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) {
        throw new ApiError(404, 'User does not exist!!');
    }
    console.log(user);
    const isPasswordValid = await user.isPasswordCorrect(password);
    console.log("isValid Password", isPasswordValid);


    if (!isPasswordValid) {

        throw new ApiError(401, "Invalid User Credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // it's depend on requirement..
    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    // * This option doest not allow user to modify 
    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged successfully"
            )
        );

});

const logoutUser = asyncHandler(async (req, res, next) => {
    // remove cookie from server
    // remove refreshToken from db
    const userId = req?.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized user");
    }

    await User.findByIdAndUpdate(userId,
        {
            $set: { refreshToken: undefined }
        },
        {
            new: true  // * this flag gave new value as result
        }
    );
    console.log('hello');
    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie('accessToken', cookieOptions)
        .clearCookie('refreshToken', cookieOptions)
        .json(
            new ApiResponse(200, {}, 'User logged Out!')
        );
});


const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const incomingRefreshToken = req.cookies.refreshAccessToken || req.headers.authorization;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Invalid refresh Token");
    }
    const decodedToken = jwt.verify(refreshAccessToken, vars.REFRESH_TOKEN_SECRET);

    const user = await User.findByIdAndUpdate(decodedToken?.userId);

    if (!user) {
        throw new ApiError(401, "Invalid refresh token");

    }
    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Unauthorized user");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);
    const options = {
        httpOnly: true,
        secure: true
    }

    res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', newRefreshToken, options)
        .res(
            new ApiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken },
                'Access token refreshed successfully!'
            )
        )


});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}