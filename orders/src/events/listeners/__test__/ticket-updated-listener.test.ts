import { Ticket } from "../../../models/ticket";
import { TicketUpdatedEvent } from "@sfstickets/common";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose, { Error } from "mongoose";
import { Message } from "node-nats-streaming";

const setUp = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    version: ticket.version + 1,
    id: ticket.id,
    price: 20,
    userId: 'asdmkasdmn',
    title: "mooonBase",
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("finds, updates, and saves a ticket", async () => {
  const { listener, data, msg  } = await setUp();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket?.version).toEqual(data.version);
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has been skipped version number", async () => {
    const { listener, data, msg, ticket } = await setUp();

    data.version = 10
  
    try{
        await listener.onMessage(data, msg);
    } catch(err){
        console.log('error occurs')
    }
   
    expect(msg.ack).not.toHaveBeenCalled();
  });
