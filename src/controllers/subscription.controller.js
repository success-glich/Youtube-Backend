import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Subscription } from "../models/subscriptions.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // * get channelId from params
  // * check if channelId exist
  // * get channel from db using id
  // * check if user is already subscribed to channel
  // * if yes, unsubscribe user from channel
  // * if no, subscribe user to channel
  const { channelId } = req.params;
  if (!channelId) {
    throw new ApiError(400, "channelId is required");
  }

  // * check if user is already subscribed to channel
  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user?._id,
  });

  if (existingSubscription) {
    await Subscription.deleteOne({
      channel: channelId,
      subscriber: req.user?._id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "unsubscribed successfully"));
  }
  await Subscription.create({
    channel: channelId,
    subscriber: req.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "subscribed successfully"));
});

// * controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  // * get channelId from params
  // * check if channelId exist
  // * get channel from db using id
  // * get subscriber list of channel
  // * return subscriber list
  // * if no subscriber found, return empty array

  const { channelId } = req.params;
  if (!channelId) {
    throw new ApiError(400, "channelId is required");
  }
  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: mongoose.Types.ObjectId(channelId),
        subscriber: { $ne: mongoose.Types.ObjectId(req.user?._id) },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscribers",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        subscribers: "$subscribers",
      },
    },
    {
      $project: {
        $subscribers: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, subscribers[0]?.subscribers));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
