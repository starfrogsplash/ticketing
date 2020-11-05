import { Listener, OrderCancelledEvent, Subjects } from "@sfstickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import {Ticket} from '../../models/ticket'
import { Error } from "mongoose";
import {TicketUpdatedPublisher} from '../publishers/ticket-updated-publisher'
import { natsWrapper } from "../../nats-wrapper";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
      const ticket = await Ticket.findById(data.ticket.id)

      if (!ticket) throw new Error('Ticket not Found')

      ticket.set({ orderId: undefined})
      await ticket.save()

      await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        version: ticket.version,
        title: ticket.title, 
        price: ticket.price, 
        userId: ticket.userId, 
        orderId: ticket.orderId
      })

      msg.ack()
  }
}
