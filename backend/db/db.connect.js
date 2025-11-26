import mongoose from "mongoose";

export const instantiateConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection to db established");
  } catch (error) {
    console.error("Connection to db failed!", error);
  }
};
