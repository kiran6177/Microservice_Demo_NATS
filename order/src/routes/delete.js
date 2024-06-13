const express = require('express');
const Order = require('../models/Order');
const { isLogin } = require('../middlewares/auth');
const OrderCancelledPublisher = require('../eventbus/publishers/OrderCancelledPublisher');
const natsWrapper = require('../eventbus/nats-client');
const router = express.Router();

router.patch('/api/orders/:id',isLogin,async (req,res,next)=>{
    try{
        const {id} = req.params;
        const order = await Order.findById({_id:id}).populate('ticket');
        if(!order){
            const error = new Error();
            error.type = 'NotFound';
            error.statusCode = 404
            error.reasons = [{message:'Order not found!!'}]
            throw error;
        }
        if(order.userId != req.user.id){
            let error = new Error();
            error.type = "Unauthorized";
            error.statusCode = 403;
            error.reasons = [{message:'Unauthorized'}]
            throw error;
        }
        order.set({
                status:'Cancelled'
            })
        await order.save();

        await new OrderCancelledPublisher(natsWrapper.getClient()).publish({
          id:order.id,
          version:order.version,
          ticket :{
            id:order.ticket._id,
          }
        })

        res.status(201).send({
          id:statusUpdate.id,
          status:statusUpdate.status,
          userId:statusUpdate.userId,
          expiresAt:statusUpdate.expiresAt,
          ticket :{
            id:order.ticket._id,
            title:order.ticket.title,
            price:order.ticket.price
          }
        });
        }catch(err){
            console.log(err.message);
            next(err)
        }
})

module.exports = router