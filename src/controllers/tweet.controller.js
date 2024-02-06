import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const createTweet = asyncHandler(async (req, res) => {
  const { content, description } = req.body;

  const newTweet = await Tweet.create({
    content,
    description,
    user: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newTweet, "Tweet created successfully!"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const tweets = await Tweet.aggregate([
    { $match: { user: new mongoose.Type.ObjectId(req.user?._id) } },
    {
      $lookup: {
        localField: "user",
        foreignField: "_id",
        from: "users",
        as: "user",
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetched successfully!"));
});
const updateTweet = asyncHandler(async (req, res) => {
  const { content, description } = req.body;
  const tweet = await Tweet.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        content,
        description,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully!"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const tweet = await Tweet.findByIdAndDelete(tweetId);
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet deleted successfully!"));
});

export default {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
};
