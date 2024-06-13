const mongoose = require('mongoose');
const {updateIfCurrentPlugin} = require('mongoose-update-if-current')

const ticketSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    orderID:{
        type:String,
        default:null,
    }
})
ticketSchema.set('versionKey','version')
ticketSchema.plugin(updateIfCurrentPlugin)

const Tickets = mongoose.model('Ticket',ticketSchema);

module.exports = Tickets;