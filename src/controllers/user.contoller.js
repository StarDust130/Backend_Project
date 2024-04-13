import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshTokn = user.generateRefreshToken();

    // add refresh token to user object
    user.refreshToken = refreshTokn;
    // save refresh token in db
    await user.save({ varlidateBeforeSave: false });

    return { accessToken, refreshTokn };
  } catch (error) {
    throw new ApiError(500, "Token generation failed 🚫");
  }
};

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

  // check for cover image
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files?.coverImage[0]?.path;
  }

  // check for avatar
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

const loginUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // find user in db
  // check email and password
  // generate access and refresh token
  // send cookies 🍪
  // return response

  // get user details from frontend
  const { username, password, email } = req.body;

  // validation - not empty

  if (!(username || email)) {
    throw new ApiError(400, "Username or Email is required to login 🫤");
  }

  // find user in db
  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user) {
    throw new ApiError(404, "User not found. Create Account  🚫");
  }

  // check password 🔐
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials(password) 🚫");
  }

  // generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  // remove password from response token field from response
  const loggedInUser = await User.findById(user._id, { refreshToken }).select(
    "-password -refreshToken"
  );

  // send cookies 🍪
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in Successfully 🥳"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // Refersh Token removal from db
  // clear cookies
  // return response

  // Refersh Token removal from db
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  // clear cookies &  return response
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User logged out successfully 🥳"));
});

export { registerUser, loginUser, logoutUser };
