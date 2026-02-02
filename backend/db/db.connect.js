import mongoose from "mongoose";

// Cache the connection to reuse across serverless function invocations
let cachedConnection = null;

export const instantiateConnection = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("Using cached database connection");
    return cachedConnection;
  }

  try {
    // Configure mongoose for serverless environment
    mongoose.set("strictQuery", false);

    const connection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    cachedConnection = connection;
    console.log("Connection to db established");
    return connection;
  } catch (error) {
    console.error("Connection to db failed!", error);
    throw error;
  }
};
