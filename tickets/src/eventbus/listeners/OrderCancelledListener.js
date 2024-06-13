const Tickets = require("../../models/tickets");
const Listener = require("../definition/base-listener");
const TicketUpdatedPublisher = require("../publishers/TicketUpdatedPublisher");

class OrderCancelledListener extends Listener{
    subject = 'order:cancelled'
    queueGroupName = 'tickets-service'

    async onMessage(data,msg){
        console.log('data',data);
        const ticket = await Tickets.findById({_id:data.ticket.id})
        if(!ticket){
            throw new Error('Ticket not Found')
        }
        ticket.set({orderID:data.id})
        await ticket.save()
        await new TicketUpdatedPublisher(natsWrapper.getClient()).publish({
            id:ticket._id,
            title:ticket.title,
            price:ticket.price,
            userId:ticket.userId,
            version:ticket.version,
            orderID:ticket.orderID
        })
        msg.ack()
    }
}

module.exports = OrderCancelledListener