import {Subjects, Publisher, ExpirationCompleteEvent} from '@sfstickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}