import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import  request  from "supertest";
import jwt from 'jsonwebtoken'

jest.mock('../nats-wrapper.ts');

let mongo: any;
beforeAll(async () => {

  jest.clearAllMocks();

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


export const signin = (): string[] =>{
  //Build a jwt payload {id,email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@gmail.com",
  }
  //create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //build session object {jwt: MY_JWT}
  const session = {jwt: token}

  //turn the session into JSON
  const sessionJSON = JSON.stringify(session);

  //encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return a string thats the cookie with the encoded data
  return [`session=${base64}`];

}