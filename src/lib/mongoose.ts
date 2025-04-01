import mongoose from "mongoose";

let isConnected = false;

const connectToDB = async () => {
  if (isConnected) return console.log("Already connected!");

  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName: "seminar-booking-app",
    });
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
};

export default connectToDB;
