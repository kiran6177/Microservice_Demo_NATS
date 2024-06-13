const Listener = require('./base-listener');

class TicketCreatedListener extends Listener{
    subject = 'ticket:created';
    queueGroupName = 'payments-service';

    onMessage(data,msg){
        console.log('data',data);
        msg.ack()
    }
} 

module.exports = TicketCreatedListener