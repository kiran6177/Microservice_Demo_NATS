const express = require("express");
const { isLogin } = require("../middlewares/auth");
const Order = require("../models/Order");
const router = express.Router();

router.get("/api/orders",isLogin, async (req, res, next) => {
  try {
    const orders = await Order.find({userId:req.user.id}).populate('ticket')
    console.log(orders);
    res.send(orders);
  } catch (err) {
    console.log(err.message);
    next(err)
  }
});

module.exports = router;
