import { Publisher, Subjects, TicketCreatedEvent} from '@sfstickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}