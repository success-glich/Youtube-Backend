import { Router } from "express";
import {
    changeCurrentPassword,
    getUserChannelProfile,
    getWatchHistory,
    loginUser,
    logoutUser,
    me,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateUserAvatar } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router
    .route("/register")
    .post(upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 8 }]), registerUser);

router
    .route('/login')
    .post(loginUser)

// * secured routes
router
    .route("/logout")
    .post(isAuthenticated, logoutUser);

router.route('/refresh-token').post(refreshAccessToken);
router.route('/change-password').post(isAuthenticated,changeCurrentPassword);
router.route('/me').get(isAuthenticated,me);
router.route('/update-account').patch(isAuthenticated,updateAccountDetails);
router.route('/avatar').patch(isAuthenticated,upload.single('avatar'),updateUserAvatar);
router.route('/cover-image').patch(isAuthenticated,upload.single('coverImage'),updateUserAvatar);

router.route('/channel/:username').get(isAuthenticated,getUserChannelProfile);
router.route('/watch-history').get(isAuthenticated,getWatchHistory);


export default router;