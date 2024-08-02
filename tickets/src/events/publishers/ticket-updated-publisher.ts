import { Publisher, Subjects, TicketUpdatedEvent } from "@ir-tixtrade/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

}