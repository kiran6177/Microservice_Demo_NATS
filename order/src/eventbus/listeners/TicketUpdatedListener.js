const Ticket = require("../../models/Ticket");
const Listener = require("../definition/base-listener");

class TicketUpdatedListener extends Listener{
    subject = 'ticket:updated'
    queueGroupName = 'orders-service'

    async onMessage(data,msg){
        const ticket = await Ticket.findById({_id:data.id,version:data.version - 1});
        if(!ticket){
            throw new Error('Ticket not Found')
        }
        const {title,price} = data;
        ticket.set({title,price});
        await ticket.save()
        console.log(ticket);

        msg.ack()
    }
}

module.exports = TicketUpdatedListener
