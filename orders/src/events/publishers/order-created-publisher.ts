import { Publisher, OrderCreatedEvent, Subjects } from "@sfstickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
