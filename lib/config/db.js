import mongoose from "mongoose";

export const ConnectDB = async () => {
  await mongoose.connect("MongoDB Url");
  console.log("DB Connected");
};
