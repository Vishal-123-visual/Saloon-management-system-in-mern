
//import jwt from "jsonwebtoken";
import Customer from "../models/customerModel.js";
import paymentmodel from "../models/paymentmodel.js";

export const createCustomer = async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({
        message: "Name and Phone are required",
        success: false,
        error: true,
      });
    }

    const exists = await Customer.findOne({ phone });
    if (exists) {
      return res.status(409).json({
        message: "Customer with this phone number already exists",
        success: false,
        error: true,
      });
    }

    const customer = new Customer(req.body);
    await customer.save();
    return res.status(200).json({
      message: "Customer created successfully",
      success: true,
      error: false,
      data: customer,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

// update customer details
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCustomer) {
      return res.status(404).json({
        message: "customer not found!",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "customer updated",
      success: true,
      error: false,
      data: updatedCustomer,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "internal server error",
      success: false,
      error: true,
    });
  }
};
// delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).json({
        message: "customer not found!",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "customer deleted",
      success: true,
      error: false,
      data : deletedCustomer
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "internal server error",
      success: false,
      error: true,
    });
  }
};
// login customer
// export const LoginCustomer = async (req, res) => {
//   try {
//     const { name, phone } = req.body;
//     if (!name || !phone) {
//       return res.status(404).json({
//         message: "Please fill all fields",
//         success: false,
//         error: true,
//       });
//     }
//     const customer = await Customer.findOne({ phone: phone });
//     if (!customer) {
//       return res.status(400).json({
//         message: "Invalid Credentials",
//         success: false,
//         error: true,
//       });
//     }
//     if (name !== customer.name) {
//       return res.status(400).json({
//         message: "invalid credentials",
//         success: false,
//         error: true,
//       });
//     }
//     // Generate tokens
//     const accessToken = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRES,
//     });

//     const refreshToken = jwt.sign(
//       { id: customer._id },
//       process.env.REFRESH_SECRET,
//       { expiresIn: process.env.REFRESH_EXPIRES || "7d" }
//     );

//     customer.refreshToken = refreshToken;
//     await customer.save();

//     res.json({
//       success: true,
//       error: false,
//       token: accessToken,
//       refreshToken,
//       customer: {
//         id: customer._id,
//         name: customer.name,
//         phone: customer.phone,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//       success: false,
//       error: true,
//     });
//   }
// };

// get custumer details by id
export const customerDetails = async(req,res)=>{
  try {
    const {id} = req.params
    const customer = await Customer.findById(id)
    if(!customer){
      return res.status(404).json({
      message: "customer not found",
      success: false,
      error: true,
    });
    }
       return res.status(200).json({
      message: "customer details",
      success: true,
      error: false,
      data : customer
    });
  } catch (error) {
     return res.status(500).json({
      message: error.message || "internal server error",
      success: false,
      error: true,
    });
  }
}

// get all customers

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    return res.status(200).json({
      message: "Customers fetched successfully",
      success: true,
      error: false,
      data: customers,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

// get customer by name or phone
function escapeRegex(text) {
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export const getCustomerByNameOrPhone = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({
        message: "Search term is required",
        success: false,
        error: true,
      });
    }

    const safeSearch = escapeRegex(search);

    const customers = await Customer.find({
      $or: [
        { name: { $regex: safeSearch, $options: "i" } },
        { phone: { $regex: safeSearch, $options: "i" } },
      ],
    }).select("-refreshToken");

    if (!customers || customers.length === 0) {
      return res.status(404).json({
        message: "No customers found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Customers found",
      success: true,
      error: false,
      customers,
    });
  } catch (error) {
    console.error("Customer search error:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};


export const getCustomerVisitStats = async (req, res) => {
  try {
    // Base aggregation to get visits per customer
    const visits = await paymentmodel.aggregate([
      {
        $group: {
          _id: "$customer",
          totalVisits: { $sum: 1 },
          lastVisit: { $max: "$createdAt" },
          totalSpent: { $sum: "$finalAmount" }
        }
      },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customerInfo"
        }
      },
      { $unwind: "$customerInfo" },
      {
        $project: {
          _id: 0,
          customerId: "$customerInfo._id",
          name: "$customerInfo.name",
          phone: "$customerInfo.phone",
          email: "$customerInfo.email",
          country: "$customerInfo.country",
          state: "$customerInfo.state",
          city: "$customerInfo.city",
          postCode: "$customerInfo.postCode",
          street: "$customerInfo.street",
          totalVisits: 1,
          lastVisit: 1,
          totalSpent: 1
        }
      }
    ]);

    // Split into categories
    const repeatCustomers = visits.filter(c => c.totalVisits > 1);
    const oneTimeCustomers = visits.filter(c => c.totalVisits === 1);

    res.json({
      success: true,
      repeatCustomers,
      oneTimeCustomers
    });
  } catch (err) {
    console.error("Error fetching customer stats:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
