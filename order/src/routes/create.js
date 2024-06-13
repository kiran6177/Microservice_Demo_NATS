const express = require('express');
const { isLogin } = require('../middlewares/auth');
const { body, validationResult } = require("express-validator");
const Ticket = require('../models/Ticket');
const Order = require('../models/Order');
const OrderCreatedPublisher = require('../eventbus/publishers/OrderCreatedPublisher');
const router = express.Router();
const natsWrapper = require('../eventbus/nats-client')

router.post('/api/orders',isLogin,[
     body('ticketId')
     .not()
     .isEmpty()
     .withMessage('Ticket ID is mandatory!!')
], async (req,res,next)=>{
    try{
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
        const {ticketId} = req.body;
        const ticket = await Ticket.findById({_id:ticketId});
        if(!ticket){
          const error = new Error();
          error.type = 'NotFound';
          error.statusCode = 404
          error.reasons = [{message:'Ticket not found!!'}]
          throw error;
        }

        const existingOrder = await Order.findOne({ticket:ticket._id,status:{$in:['Created','AwaitingPayment','Completed']}});
        if(existingOrder){
          const error = new Error();
          error.type = 'BadRequest';
          error.statusCode = 400
          error.reasons = [{message:'Ticket reserved!!'}]
          throw error;
        }

        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + 15 * 60);

        const order = await Order.create({
          userId:req.user.id,
          status:'Created',
          expiresAt:expiration,
          ticket:ticket._id
        })


        await new OrderCreatedPublisher(natsWrapper.getClient()).publish({
          id:order._id,
          status:order.status,
          userId:order.userId,
          expiresAt:order.expiresAt.toISOString(),
          ticket :{
            id:ticket._id,
            title:ticket.title,
            price:ticket.price
          },
          version:order.version
        })

        res.status(201).send({
          id:order.id,
          status:order.status,
          userId:order.userId,
          expiresAt:order.expiresAt,
          ticket :{
            id:ticket._id,
            title:ticket.title,
            price:ticket.price
          }});
    }catch(err){
      console.log(err.message);
      next(err)
    }
})

module.exports = router