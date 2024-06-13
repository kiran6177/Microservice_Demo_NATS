const express = require("express");
const Tickets = require("../models/tickets");

const router = express.Router();

router.get("/api/tickets", async (req, res, next) => {
  try {
    const tickets = await Tickets.find();
    const ticketsArr = tickets.map(tick=>{
      return {
        id:tick._id,
        title:tick.title,
        price:tick.price,
        userId:tick.userId,
        orderID:tick.orderID
      }
    })
    res.status(200).send(ticketsArr);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

module.exports = router;
