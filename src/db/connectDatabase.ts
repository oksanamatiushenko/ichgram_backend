import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

 if (!MONGODB_URI) {
      throw new Error("DATABASE_URI is not defined in environment variables");
    }

const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Successfully connected to database");
  }
   catch (error) {
    if (error instanceof Error) {
      console.error(`Error connecting to database ${error.message}`);
      throw error;
    }
    console.log(`Unknow error ${error}`);
  }
};

export default connectDatabase;
