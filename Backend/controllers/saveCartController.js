// controllers/savedCartController.js
import SaveCartModel from "../models/saveCartModel.js";


// Save current cart
export const saveCart = async (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in cart" });
    }

    // create saved cart
    const savedCart = await SaveCartModel.create({
       customer,
      items,
    });

    const populatedSavedCart = await SaveCartModel.findById(savedCart?._id).populate('customer')

    return res.status(201).json({
      success: true,
      message: "Cart saved successfully",
      data: populatedSavedCart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


/// get all saved carts
export const getAllSavedCarts = async (req, res)=>{
    try {
        const savedCarts = await SaveCartModel.find().populate('customer').populate('items.serviceId','serviceName imageUrl discountPrice price');
        return res.status(200).json({
            success: true,
            data: savedCarts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// get saved carts by id
export const getSavedCartById = async(req,res)=>{
    try {
    const savedCart = await SaveCartModel.findById(req.params.id).populate('customer').populate("items.serviceId");
    if (!savedCart) {
      return res.status(404).json({ success: false, message: "Saved cart not found" });
    }
    return res.json({ success: true, data: savedCart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// delete saved cart by id
export const deleteSavedCart = async (req, res)=>{
    try {
        const { id } = req.params;
        await SaveCartModel.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Saved cart deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// delete all saved carts
export const deleteAllSavedCarts = async (req, res)=>{
    try {
        await SaveCartModel.deleteMany();
        return res.status(200).json({
            success: true,
            message: "All saved carts deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Search saved carts
export const searchSavedCart = async (req, res) => {
  try {
    const { query } = req.query;

    const savedCarts = await SaveCartModel.find()
    .populate({
      path : 'customer',
      match :{
      $or: [
        { name: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
      ],
      },
    })
    .populate('items.serviceId')

    res.json({ success: true, data: savedCarts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
