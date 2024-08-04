import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@ir-tixtrade/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/tickets";
import { Order } from "../models/orders";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 60 * 1;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be valid"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {ticketId} = req.body;
    
    //Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if(!ticket){
        throw new NotFoundError();
    }
    //Run quary to look at all orders. Find an order where the ticket is the ticket we just foud and the orders status is not cancelld.
    //If we found an order from that means the ticket is reserved
    const isReserved = await ticket.isReserved();
    if(isReserved){
        throw new BadRequestError("Ticket is already reserved");
    }

    //Make sure that the ticket is not already reserved

    //Calculate the expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    //Build the order and save it to the database
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });

    await order.save();

    //Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket:{
        id: ticket.id,
        price: ticket.price
      }
    })

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
