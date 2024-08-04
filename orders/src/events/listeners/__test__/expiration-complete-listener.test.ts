import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/tickets";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { ExpirationCompleteEvent, OrderStatus } from "@ir-tixtrade/common";
import { Order } from "../../../models/orders";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);
  
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "concert",
      price: 20,
    });
    await ticket.save();
    const order = Order.build({
        status: OrderStatus.Created,
        userId: "dfjsljfk",
        expiresAt: new Date(),
        ticket
    })
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }
  
    //@ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };
  
    //return all of this
    return { listener, order, data, ticket, msg };
  };

it("updates the order status to cancelled", async ()=>{
    const  { listener, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})
it("emit an OrderCancelledEvent", async ()=>{
    const  { listener, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(eventData.id).toEqual(order.id);
})
it("acks the message", async ()=>{
    const  { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})