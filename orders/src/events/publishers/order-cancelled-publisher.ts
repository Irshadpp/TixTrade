import { OrderCancelledEvent, Publisher, Subjects } from "@ir-tixtrade/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}