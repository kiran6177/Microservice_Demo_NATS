const express = require("express");
const app = express();
const mongoose = require("mongoose");
const natsWrapper = require('./eventbus/nats-client')

const createOrder = require("./routes/create");
const viewOrder = require("./routes/view");
const viewAllOrders = require("./routes/viewAll");
const deleteOrder = require("./routes/delete");
const errorHandler = require("./middlewares/errorhandler");
const TicketCreatedListener = require("./eventbus/listeners/TicketCreatedListener");
const TicketUpdatedListener = require("./eventbus/listeners/TicketUpdatedListener");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(createOrder);
app.use(viewOrder);
app.use(viewAllOrders);
app.use(deleteOrder);


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

    new TicketCreatedListener(natsWrapper.getClient()).listen();
    new TicketUpdatedListener(natsWrapper.getClient()).listen();

    await mongoose.connect("mongodb://orders-mongo-svc:27017/tickets");
    console.log("orders connected");
  } catch (error) {
    console.log(error.message);  
  } 
}; 
 
connect();

app.listen(3004, () => {
  console.log("Orders Listening on PORT 3004!");
});
 