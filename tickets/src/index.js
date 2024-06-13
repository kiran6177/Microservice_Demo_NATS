const express = require("express");
const app = express();
const mongoose = require("mongoose");
const natsWrapper = require('./eventbus/nats-client')

const createTicket = require("./routes/create");
const viewTicket = require("./routes/view");
const viewAllTicket = require("./routes/viewall");
const updateTicket = require("./routes/update");
const errorHandler = require("./middlewares/errorhandler");
const OrderCreatedListener = require("./eventbus/listeners/OrderCreatedListener");
const OrderCancelledListener = require("./eventbus/listeners/OrderCancelledListener");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(createTicket);
app.use(viewTicket);
app.use(viewAllTicket);
app.use(updateTicket);


app.all("*", async (req, res, next) => {
  try {
    let error = new Error();
    error.type = "NotFound";
    error.statusCode = 404;
    error.reasons = [{ message: "Not Found" }];
    throw error;
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

const connect = async () => {
  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URL);
    natsWrapper.getClient().on('close',()=>{
      console.log('NATS connection closed!'); 
      process.exit();
    })
    process.on('SIGINT',()=> natsWrapper.getClient().close())
    process.on('SIGTERM',()=> natsWrapper.getClient().close())

    new OrderCreatedListener(natsWrapper.getClient()).listen();
    new OrderCancelledListener(natsWrapper.getClient()).listen();

    await mongoose.connect("mongodb://tickets-mongo-svc:27017/tickets");
    console.log("tickets connected");
  } catch (error) {
    console.log(error.message);  
  } 
}; 
 
connect();

app.listen(3002, () => {
  console.log("Tickets Listening on PORT 3002!");
});
