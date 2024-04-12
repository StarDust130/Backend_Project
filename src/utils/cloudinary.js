import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return;

    // Upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // File Added Successfully
    console.log(
      "📂File uploaded successfully in cloudinary✅ : ",
      response.url
    );
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Delete file from local storage
    console.error("❌Error in uploading file on cloudinary❌: ", error);
    return null;
  }
};

export { uploadOnCloudinary };
