import mongoose from "mongoose";
import { Ticket } from "../../../models/tickets";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@ir-tixtrade/common";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";

const setup = async () => {
  //create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  //create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  //create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: "new concert",
    price: 100,
    userId: "dslfjlsk",
  };

  //create a fake msg object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  //return all of this
  return { listener, data, ticket, msg };
};

it("finds, updates, and saves a ticket", async () => {
  const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  //call the onMessage function with the data object + msg object
  await listener.onMessage(data, msg);

  //write assertion to make sure ack function called
  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack function if the event has a skipped event version", async () => {
  const { listener, data, msg } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
