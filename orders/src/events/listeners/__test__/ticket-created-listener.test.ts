import {Ticket} from '../../../models/ticket'
import { TicketCreatedEvent} from '@sfstickets/common'
import {TicketCreatedListener} from '../ticket-created-listener'
import {natsWrapper} from '../../../nats-wrapper'
import mongoose from 'mongoose'
import {Message} from 'node-nats-streaming'

const setUp = async () => {
    const listener = new TicketCreatedListener(natsWrapper.client)

    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert'
    }

    // @ts-ignore
    const msg: Message = {
         ack: jest.fn()
    }

    return { listener, data, msg}

}

it('creates and saves a ticket', async () => {
    const {listener, data, msg} = await setUp()

    await listener.onMessage(data, msg)

    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined()
    expect(ticket?.title).toEqual(data.title)
    expect(ticket?.price).toEqual(data.price)
})

it('acks the message', async () => {
    const {listener, data, msg} = await setUp()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()

})