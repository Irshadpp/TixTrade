import mongoose from "mongoose";
import {app} from "./app"

const start = async () => {
  const jwtKey = process.env.JWT_KEY;

  if (!jwtKey) {
    throw new Error("JWT_KEY must be defined");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017");
    console.log("Auth-mongodb connected");
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000!!");
  });
};
start();
