const Publisher = require('../definition/base-publisher');

class TicketUpdatedPublisher extends Publisher{
    subject = 'ticket:updated'
}

module.exports = TicketUpdatedPublisher