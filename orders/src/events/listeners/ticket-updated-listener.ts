import { Listener, Subjects, TicketUpdatedEvent } from "@ir-tixtrade/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject : Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message){
        const ticket = await Ticket.findByIdAndPrevVersion(data);
        if(!ticket){
            throw new Error("ticket not found");
        }
        const {title, price} = data;
        ticket.set({title, price});
        await ticket.save();

        msg.ack();
    }
}