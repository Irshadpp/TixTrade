import { Publisher, Subjects, TicketCreatedEvent } from "@ir-tixtrade/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
