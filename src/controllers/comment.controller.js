import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, null, "working fine"));
});
const addComment = asyncHandler(async (req, res) => {});

export { addComment, getVideoComments };
