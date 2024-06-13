const Ticket = require("../../models/Ticket");
const Listener = require("../definition/base-listener");

class TicketCreatedListener extends Listener{
    subject = 'ticket:created'
    queueGroupName = 'orders-service'

    async onMessage(data,msg){
        const {id,title,price} = data;
        
        const ticket = await Ticket.create({
            _id:id,
            title,
            price
        })
        console.log(ticket);
        msg.ack()
    }
}

module.exports = TicketCreatedListener