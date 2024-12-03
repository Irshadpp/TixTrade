import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const start = async () => {

  console.log("Startinig payment service....")

  const jwtKey = process.env.JWT_KEY;
  const MONGO_URI = process.env.MONGO_URI;
  const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID;
  const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID;
  const NATS_URL = process.env.NATS_URL;

  if (!jwtKey) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  try {
    await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(MONGO_URI);
    console.log("payments-mongodb connected");
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log("payments Listening on port 3000!!");
  });
};
start();
