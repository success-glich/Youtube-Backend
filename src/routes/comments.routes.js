import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  addComment,
  getVideoComments,
} from "../controllers/comment.controller.js";

const router = Router();

router.use(isAuthenticated);

router.route("/:videoId").get(getVideoComments).post(addComment);

export default router;
