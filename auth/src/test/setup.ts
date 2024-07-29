import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import  request  from "supertest";

let mongo: any;
beforeAll(async () => {

    process.env.JWT_KEY = "abcde"
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});


export const signin = async() =>{
  const response = await request(app)
  .post("/api/users/signup")
  .send({
    email: "test@gmail.com",
    password: "123456",
  })
  .expect(201);

  const cookie = response.get("Set-Cookie");
  return cookie as string[];
}