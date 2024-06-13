const mongoose = require('mongoose');
const {updateIfCurrentPlugin} = require('mongoose-update-if-current')

const orderSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    expiresAt:{
        type:mongoose.Schema.Types.Date
    },
    ticket:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Ticket'
    }
})

orderSchema.set('versionKey','version')
orderSchema.plugin(updateIfCurrentPlugin)

const Order = mongoose.model('Order',orderSchema);

module.exports = Order