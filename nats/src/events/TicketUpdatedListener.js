const Listener = require("./base-listener");

class TicketUpdatedListener extends Listener{
    subject = 'ticket:updated'
    queueGroupName = 'payments-service'

    onMessage(data,msg){
        console.log("data",data);
        msg.ack()
    }
}

module.exports = TicketUpdatedListener