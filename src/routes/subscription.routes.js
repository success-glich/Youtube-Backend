import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { toggleSubscription } from "../controllers/subscription.controller";

const router = Router();
router.use(isAuthenticated); // * Apply verifyJWT to all routes in this file

router.route("/c/:channelId").get().post(toggleSubscription);
