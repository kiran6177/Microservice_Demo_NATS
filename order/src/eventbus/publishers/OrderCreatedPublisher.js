const Publisher = require("../definition/base-publisher");

class OrderCreatedPublisher extends Publisher{
    subject = 'order:created' 
}

module.exports = OrderCreatedPublisher