const Publisher = require("../definition/base-publisher");

class TicketCreatedPublisher extends Publisher{
    subject = 'ticket:created' 
}

module.exports = TicketCreatedPublisher