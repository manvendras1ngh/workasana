import mongoose from "mongoose";

export const instantiateConnection = async () => {
  try {
    mongoose.set("strictQuery", false);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("Connection to db established");
  } catch (error) {
    console.error("Connection to db failed!", error);
    throw error;
  }
};
