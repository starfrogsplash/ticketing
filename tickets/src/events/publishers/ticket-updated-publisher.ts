import { Publisher, Subjects, TicketUpdatedEvent} from '@sfstickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: any = Subjects.TicketUpdated
  }
  