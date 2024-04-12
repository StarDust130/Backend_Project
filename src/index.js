import connectDB from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ path: "./.env" });

//? Connect to MongoDB
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT} 🤩`);
      app.on("error", (error) => console.log("Error: ", error));
    });
    console.log("Connected to MongoDB 🚀");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB 🚫: ", error);
  });
