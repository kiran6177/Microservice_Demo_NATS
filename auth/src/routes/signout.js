const express = require('express');
const { inValidate } = require('../utils/jwt');
const router =  express.Router();

router.get('/api/users/signout',(req,res)=>{
    try {
        if(req.headers && req.headers['authorization']){
            const token = req.headers['authorization'].split(' ')[1];
            const rehashToken = inValidate(token)
            res.send({userToken:rehashToken});
        }else{
            const error = new Error();
            error.type = 'BadRequest'
            error.statusCode = 400
            error.reasons = [{message:'No token exist!'}]
        }
    } catch (error) {
        console.log(error.message);
    }
})

module.exports = router 