const Publisher = require('../definition/base-publisher');

class OrderCancelledPublisher extends Publisher{
    subject = 'ticket:cancelled'
}

module.exports = OrderCancelledPublisher