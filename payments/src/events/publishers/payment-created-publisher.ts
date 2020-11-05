import { Subjects, Publisher, PaymentCreatedEvent } from '@sfstickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
 