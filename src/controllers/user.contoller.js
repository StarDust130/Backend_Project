import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  // validation - not empty
  // check if user already exists: email , username
  // check for images , check for avatar
  // upload images to cloudinary , check avatar
  // create user object - create entry in db
  // remove password from response token field from response
  // check for user creation
  // return response

  // get user details from frontend
  const { fullName, username, email, password } = req.body;

  // validation - not empty
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required 🫤");
  }

  // check if user already exists: email , username
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email and username already exist 🚫");
  }
  // check for images, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;


  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required 🖼️");
  }

  // upload images to cloudinary , check avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar Image upload failed 🌌");
  }

  // create user object - create entry in db
  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // remove password from response token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken "
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "User creation failed 🚫");
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registerd successfully 🥳"));
});

export { registerUser };
