import mongoose from "mongoose";

// Import all models synchronously to ensure they are registered
import "@/model/teacher";
import "@/model/students";
import "@/model/category";
import "@/model/courses";
import "@/model/lesson";
import "@/model/quiz";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables");
  }

  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    isConnected = true;

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error", error);
    throw error;
  }
}
export default connectDB;