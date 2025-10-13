import CartModel from "../models/cartModel.js";
import Services from "../models/serviceModel.js";


// add item to cart 
export const addItemToCart = async(req,res)=>{
    try {
        const {serviceId,quantity} = req.body;
        const userId = req.user.id
        // console.log('userid',userId)
        // console.log('service',serviceId)
        // check service by id 
        if(!userId){
            return res.status(401).json({
                message : "Your are not authorized or logged in!",
                success : false
          })
        }
        const service = await Services.findById(serviceId)
        if(!service){
            return res.status(404).json({
                message : "product not found!",
                success : false,
                error : true
            })
        }
        // check existing items to cart 
        const existingItem = await CartModel.findOne({userId : userId , serviceId : serviceId})
        if(existingItem){
            return res.status(409).json({
                message : "This item already added to cart!",
                success : false,
                error : true
            })
        }
    
        // add new item to cart 
        const newItem = await CartModel({
            userId,
            serviceId,
            quantity,
            price : service.discountPrice ? service.price - service.discountPrice : service.price,
            totalPrice : quantity * (service.discountPrice ? service.price - service.discountPrice : service.price)
        })

        await newItem.save()
        await newItem.populate('serviceId')

        return res.status(200).json({
            message : "Item add to cart",
            success : true,
            error : false,
            data : newItem
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message,
            success : false,
            error : true
        })
    }
}

//  increase ,decrease quantity of cart item 
export const updateCartItemQty = async (req,res)=>{
    try {
        const {_id,quantity} = req.body;
        const userId = req.user.id
        // check item into cart 
        const cartItem = await CartModel.findOne({_id : _id , userId : userId}).populate('serviceId')
        if(!cartItem){
            return res.status(404).json({
                message : "item not found in cart!",
                success : false,
                error : true
            })
        }

        // if quantity = 0 , delete from cart 
        if(quantity === 0){
            await CartModel.deleteOne({_id , userId})
            return res.status(201).json({
                message :"item deleted to cart",
                success : true,
                error : false
            })
        }

        // update quantity of item 
        cartItem.quantity = quantity
        cartItem.totalPrice = cartItem.price*quantity

        await cartItem.save()

        
        return res.status(200).json({
            message : "cart item updated",
            success : true,
            error : false,
            data : cartItem
        })

    } catch (error) {
         return res.status(500).json({
            message : error.message,
            success : false,
            error : true
        })
    }
}

// delete items from cart 
export const deleteItemToCart = async (req,res)=>{
    try {
        const {_id}  = req.body;
        const userId = req.user.id
        
        // delete items from cart 
        const dleleteItem = await CartModel.deleteOne({_id : _id , userId : userId})
        return res.status(200).json({
            message : "Item deleted",
            success : true,
            error : false
        })
    } catch (error) {
          return res.status(500).json({
            message : error.message,
            success : false,
            error : true
        })
    }
}

// clear all items from cart 
export const clearCart = async (req,res)=>{
    try {
        const userId = req.user.id
        await CartModel.deleteMany({userId : userId})
        return res.status(200).json({
            message : "All items removed from cart",
            success : true,
            error : false
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message,
            success : false,
            error : true
        })
    }
}


// get cart items 
export const getCartItems = async(req,res)=>{
    try {
        const userId = req.user.id
        if(!userId){
        return res.status(404).json({
            message : "you are not loged In",
            success : false,
            error : true,
           
        })
        }
        const cartItems = await CartModel.find({userId : userId}).populate('serviceId')
        return res.status(200).json({
            message : "all items",
            success : true,
            error : false,
            data : cartItems
        })
    } catch (error) {
          return res.status(500).json({
            message : error.message,
            success : false,
            error : true
        })
    }
}