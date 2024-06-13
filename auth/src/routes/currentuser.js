const express = require('express');
const { isLogin } = require('../middlewares/auth');

const router =  express.Router();

router.get('/api/users/currentuser',isLogin,(req,res,next)=>{
   try {
    return res.send({currentUser:req.user || null})
   } catch (error) {
        console.log(error.message);
        next(error)
   }
})

module.exports = router 