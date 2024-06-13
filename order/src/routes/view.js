const express = require('express');
const Order = require('../models/Order');
const { isLogin } = require('../middlewares/auth');
const router = express.Router();

router.get('/api/orders/:id',isLogin,async (req,res,next)=>{
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
        res.status(201).send(order);
        }catch(err){
            console.log(err.message);
            next(err)
        }
})

module.exports = router