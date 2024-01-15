
import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import {createTweet,getUserTweets,updateTweet,deleteTweet} from "../controllers/tweet.controller";

const router = Router();

router.use(isAuthenticated);


router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router