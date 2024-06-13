const express = require("express");
const { isLogin } = require("../middlewares/auth");
const { body, validationResult } = require("express-validator");
const Tickets = require("../models/tickets");
const TicketCreatedPublisher = require("../eventbus/publishers/TicketCreatedPublisher");
const natsWrapper = require("../eventbus/nats-client");

const router = express.Router();

router.post(
  "/api/tickets/create",
  isLogin,
  [body('title')
  .not()
  .isEmpty()
  .withMessage("Title is required"),
  ],
  async(req, res, next) => {
    try {
        console.log("create",req.body);
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

        const ticket  = await Tickets.create({
            title,
            price,
            userId:req.user.id
        })
        await new TicketCreatedPublisher(natsWrapper.getClient()).publish({
          id:ticket._id,
          title:ticket.title,
          price:ticket.price,
          userId:ticket.userId,
          version:ticket.version
        })
        const ticketOrg = {id:ticket._id,title:ticket.title,price:ticket.price,userId:ticket.userId}
        res.status(200).send(ticketOrg)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
);

module.exports = router;
