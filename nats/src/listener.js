const {randomBytes} = require('crypto');
const nats = require('node-nats-streaming');
const TicketCreatedListener = require('./events/ticketCreatedListener');
const TicketUpdatedListener = require('./events/TicketUpdatedListener');


const stan =  nats.connect('ticketing',randomBytes(4).toString('hex'),{
    url:'http://localhost:4222'
})

stan.on('connect',()=>{
    console.log('Listener connected to NATS');

    stan.on('close',()=>{
        console.log('NATS connection closed');
        process.exit();
    })

    new TicketCreatedListener(stan).listen()
    new TicketUpdatedListener(stan).listen()
})


