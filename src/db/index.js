import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected:🍀 ${connectionInstance.connection.host}`
    );
    console.log(`\n connectionInstance 💥: ${connectionInstance}`);
    console.log("Database connected 🦄✅");
  } catch (error) {
    console.log("Error 😥: ", error);
    process.exit(1);
  }
};

export default connectDB;
