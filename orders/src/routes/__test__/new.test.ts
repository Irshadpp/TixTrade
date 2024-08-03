import request from "supertest";
import mongoose from "mongoose"
import { app } from "../../app";
import { signin } from "../../test/setup";
import { Ticket } from "../../models/tickets";
import { Order } from "../../models/orders";
import { OrderStatus } from "@ir-tixtrade/common";
import { natsWrapper } from "../../nats-wrapper";

it("returns a not found error if the ticket does not exixt", async()=>{
    const ticketId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
    .post('/api/orders')
    .set("Cookie", signin())
    .send({ticketId})
    .expect(404);
});

it("returns an error if the ticket is already reserved", async ()=>{
    const ticket = Ticket.build({
        title: "concert",
        price: 20
    });
    await ticket.save();

    const order = Order.build({
        ticket,
        userId: "djflkaslf",
        status: OrderStatus.Created,
        expiresAt: new Date(),
    });
    await order.save();

    await request(app)
    .post('/api/orders')
    .set("Cookie", signin())
    .send({ticketId: ticket.id})
    .expect(400);
});

it("reserves a ticket", async ()=>{
    const ticket = Ticket.build({
        title: "concert",
        price: 20
    });
    await ticket.save();

    await request(app)
    .post('/api/orders')
    .set("Cookie", signin())
    .send({ticketId: ticket.id})
    .expect(201);
});

it("Emits an order created event", async ()=>{
    const ticket = Ticket.build({
        title: "concert",
        price: 20
    });
    await ticket.save();

    await request(app)
    .post('/api/orders')
    .set("Cookie", signin())
    .send({ticketId: ticket.id})
    .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
});