const express = require("express");
const { isLogin } = require("../middlewares/auth");
const { body, validationResult } = require("express-validator");
const Tickets = require("../models/tickets");
const TicketUpdatedPublisher = require("../eventbus/publishers/TicketUpdatedPublisher");
const natsWrapper = require("../eventbus/nats-client");

const router = express.Router();

router.put(
  "/api/tickets/:id",
  isLogin,
  [body("title")
  .not()
  .isEmpty()
  .withMessage("Title is required"),
  ],
  async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          let error = new Error();
          error.type = "RequestValidation";
          error.statusCode = 400;
          error.reasons = errors.array().map((error) => {
            return { message: error.msg, field: error.path };
          });
          throw error;
        }

        const { title,price } = req.body;
        const {id} = req.params


        const isUser = await Tickets.findById({_id:id})
        if(isUser.orderID){
          const error = new Error();
          error.type = "BadRequest";
          error.statusCode = 400
          error.reasons = [{message:"Tickeet is reserved!"}]
          throw error;
        }
        if(isUser?.userId === req.user.id ){
          isUser.set({
            title,
            price,
            });
            await isUser.save();
            const ticket = await Tickets.findById({_id:id})
            await new TicketUpdatedPublisher(natsWrapper.getClient()).publish({
              id:ticket._id,
              title:ticket.title,
              price:ticket.price,
              userId:ticket.userId,
              version:ticket.version
            })
            const ticketOrg = {id:ticket._id,title:ticket.title,price:ticket.price,userId:ticket.userId}
          res.status(200).send(ticketOrg)
        }else{
            const error = new Error();
            error.type = "Unauthorized";
            error.statusCode = 403
            error.reasons = [{message:"Unauthorized user!"}]
            throw error;
        }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
);

module.exports = router;
