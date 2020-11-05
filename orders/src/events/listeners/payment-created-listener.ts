import {Listener, PaymentCreatedEvent, Subjects, OrderStatus} from '@sfstickets/common'
import {Message} from 'node-nats-streaming'
import {queueGroupName} from './queue-group-name'
import {Order} from '../../models/order'
import { Error } from 'mongoose'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    queueGroupName = queueGroupName
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message){
        const order = await Order.findById(data.orderId)

        if(!order) throw new Error('Order not found')

        if(order.status === OrderStatus.Complete) {
            return msg.ack()
        }

        order.set({
            status: OrderStatus.Complete
        })

        await order.save()

        msg.ack()
    }
}