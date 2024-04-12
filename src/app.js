import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//! Middlewares 😺
app.use(
  cors({
    origin: process.env.CORS_ORIGN,
    credentials: true,
  })
);
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());


//! routes import 😹
import userRouter from "./routes/user.routes.js";



//! routes declaration 😽
app.use("/api/v1/users", userRouter);



export default app;
