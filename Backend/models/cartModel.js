import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
    serviceId :{
        type : mongoose.Schema.ObjectId,
        ref : "Service",
        required : true
    },
    userId :{
        type : mongoose.Schema.ObjectId,
        ref :"user",
        required : true
    },
    quantity :{
        type : Number,
        default :1,
        required : true
    },
    price : {
        type : Number,
        default : 0,
        required : true
    },
    totalPrice : {
        type : Number,
        default : 0,
        required :true
    },
},
{timestamps : true})

const CartModel = mongoose.model('cart',cartSchema)

export default CartModel


