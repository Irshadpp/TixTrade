import { OrderCreatedEvent, Publisher, Subjects } from "@ir-tixtrade/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}