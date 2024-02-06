import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Types } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

const publishAVideo = asyncHandler(async (req, res) => {
  // *  get title & description from req.body
  // * validation not empty
  // *  check for video
  // * check for thumbnail
  // * upload them to cloudinary, video
  // *  create video object -create entry in db
  // *  return response
  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "title and description are required");
  }

  const videoLocalPath = req.files?.videoFile[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video File is required");
  }
  let thumbnailLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    thumbnailLocalPath = req.files.thumbnail[0].path;
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!videoFile) {
    throw new ApiError(500, "Error while uploading video on cloudinary");
  }

  const video = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    duration: videoFile.duration,
    thumbnail: thumbnail?.url || "",
    owner: req.user._id,
  });

  res
    .status(200)
    .json(new ApiResponse(200, { video }, "video uploaded successfully"));
});

export { getAllVideos, publishAVideo };
