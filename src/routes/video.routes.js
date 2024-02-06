import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { getAllVideos } from "../controllers/video.controller.js";
const router = Router();

router.use(isAuthenticated); // * Apply isAuthenticate middleware to all routes in this file

router.route("/").get(getAllVideos);

// * https://github.com/hiteshchoudhary/chai-backend/blob/main/src/controllers/video.controller.js

export default router;
