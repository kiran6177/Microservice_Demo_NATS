const nats = require('node-nats-streaming');
const TicketCreatedPublisher = require('./events/TicketCreatedPublisher');

const stan = nats.connect('ticketing','abc',{
    url:'http://localhost:4222'
});

stan.on('connect',async ()=>{
    try{
    console.log("Publisher connected");

    const data = {
        title:'asshin',
        price:23,
        version:1
    }

    const publisher = new TicketCreatedPublisher(stan);
    await publisher.publish(data)
    }catch(err){
        console.log(err.message);
    }
})