import { Listener, OrderCreatedEvent, Subjects } from "@ir-tixtrade/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queu-group-name";
import { Ticket } from "../../model/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        //Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);

        //If no ticket, throw error
        if(!ticket){
            throw new Error("Ticket not found")
        }

        //Mark the ticket as reserved by setting its orderId property
        ticket.set({orderId: data.id});

        //save the ticket
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        })

        //ack the msg
        msg.ack();
    }
}