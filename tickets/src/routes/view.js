const express = require("express");
const Tickets = require("../models/tickets");

const router = express.Router();

router.get(
  "/api/tickets/:id",
  async(req, res, next) => {
    try {
        const ticket  = await Tickets.findById({
            _id:req.params.id
        })
        if(!ticket){
            let error = new Error();
            error.type = "NotFound";
            error.statusCode = 404;
            error.reasons = [{message:'Ticket Not Found!'}]
            throw error;
        }
        const ticketOrg = {id:ticket._id,title,price,userId}
      res.status(200).send(ticketOrg)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
);

module.exports = router;
