import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  const jwtKey = process.env.JWT_KEY;
  const MONGO_URI = process.env.MONGO_URI;

  if (!jwtKey) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!MONGO_URI) {
    throw new Error("JWT_KEY must be defined");
  }
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Tickets-mongodb connected");
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log("Tickets Listening on port 3000!!");
  });
};
start();
