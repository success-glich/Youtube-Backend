import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Types } from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  const { _id } = req.user;

  const sortObject = {};
  sortObject[`${sortBy ?? "createdAt"}`] = sortType === "asc" ? 1 : -1;

  const matchObject = {
    owner: new Types.ObjectId(userId),
  };
  if (query) matchObject.title = { $regex: query, $options: "i" };

  if (userId?.toString() !== _id.toString()) {
    matchObject.private = false;
  }
  const pageNumber = Number(page) ? Number(page) : 1;
  const sizeLimit = Number(limit) ? Number(limit) : 10;

  const videos = await Video.aggregate([
    {
      $match: matchObject,
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $sort: sortObject,
    },
    {
      $skip: (pageNumber - 1) * sizeLimit,
    },
    {
      $limit: sizeLimit,
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { videos }, "videos fetched successfully"));
});

export { getAllVideos };
