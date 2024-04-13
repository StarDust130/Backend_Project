import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/user.contoller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlerware.js";

const router = Router();

router.route("/register").post(
  // middleware to upload images
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),

  registerUser
);

router.route("/login").post(loginUser);

//secured routes - verifyJWT middleware for verifying token
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
