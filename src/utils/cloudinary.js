import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import vars from "../config/vars.js";

cloudinary.config({
  cloud_name: vars.CLOUDINARY_CLOUD_NAME,
  api_key: vars.CLOUDINARY_API_KEY,
  api_secret: vars.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  console.log("local Path", localFilePath);
  try {
    if (!localFilePath) {
      return null;
    }
    // * upload the file on cloudinary from localFilePath
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "videoTube",
    });

    // * File has been uploaded successfully TODO: need to observe it
    console.log("file is uploaded on cloudinary", response);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // * remove the locally saved temporary file as the upload operation got fail
    fs.unlinkSync(localFilePath);
    console.log("error in cloudinary", error);
    return null;
  }
};

const removeOnCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      return null;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    console.log("file is uploaded on cloudinary", response);

    return result;
  } catch (error) {
    console.log("Error while destroying in cloudinary", error);
    return null;
  }
};

export { uploadOnCloudinary, removeOnCloudinary };
