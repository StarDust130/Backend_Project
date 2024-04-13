import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  // check if token exists
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Access 🚫");
    }

    // verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // find user in db
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    // check if user exists
    if (!user) {
      throw new ApiError(401, "User not found. Create Account  🚫");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token 🚫");
  }
});
