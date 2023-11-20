import { v2 as cloudinary } from 'cloudinary';
import fs from "node:fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null
        }
        // * upload the file on cloudinary from localFilePath
        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        // * File has been uploaded successfully
        console.log("file is uploaded on cloudinary", result.url);
        fs.unlinkSync(localFilePath);
        return result;
    } catch (error) {

        // * remove the locally saved temporary file as the upload operation got fail
        fs.unlinkSync(localFilePath);
        console.log(error);
        return null;
    }
}

export {

    uploadOnCloudinary
}


