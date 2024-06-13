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
})

ticketSchema.set('versionKey','version')
ticketSchema.plugin(updateIfCurrentPlugin)

const Ticket = mongoose.model('Ticket',ticketSchema);

module.exports = Ticket 