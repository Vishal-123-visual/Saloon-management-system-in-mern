import paymentmodel from "../models/paymentmodel.js";

// ---------------- Create Payment ----------------
export const createPayment = async (req, res) => {
  try {
    const {
      customer,  /// customer id
      items,
      total,
      discount,
      discountType,
      finalAmount,
      paymentMode,
    } = req.body;

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Customer's name & number are required",
      });
    }

    // ✅ Save payment
    const payment = new paymentmodel({
      customer,
      items,
      total,
      discount,
      discountType,
      finalAmount,
      paymentMode,
      createdBy: req.user.id, // admin/staff
    });

    await payment.save();

    // ✅ Populate service details before sending back
    const populatedPayment = await paymentmodel
      .findById(payment._id)
      .populate('customer')
      .populate("items.serviceId", "serviceName price")

    return res.status(201).json({
      success: true,
      message: "Payment saved successfully",
      data: populatedPayment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- Get All Payments ----------------
export const getAllPayments = async (req, res) => {
  try {
    let { from, to, range } = req.query;

    let filter = {};

    // ---------------- Quick Filters ----------------
    if (range) {
      let months = 0;
      if (range === "1m") months = 1;
      if (range === "2m") months = 2;
      if (range === "3m") months = 3;

      if (months > 0) {
        const now = new Date();
        const pastDate = new Date();
        pastDate.setMonth(now.getMonth() - months);

        filter.createdAt = { $gte: pastDate, $lte: now };
      }
    }

    // ---------------- Custom Date Range ----------------
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      // Include whole end day
      toDate.setHours(23, 59, 59, 999);

      filter.createdAt = { $gte: fromDate, $lte: toDate };
    }

    const payments = await paymentmodel
      .find(filter)
      .populate("customer")
      .populate("items.serviceId", "serviceName price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- Get Payment By ID ----------------
export const getPaymentById = async (req, res) => {
  try {
    const payment = await paymentmodel
      .findById(req.params.id)
      .populate('customer')
      .populate("items.serviceId", "serviceName price")

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    return res.status(200).json({ success: true, data: payment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



// controllers/paymentStatsController.js
export const getPaymentStats = async (req, res) => {
  try {
    const { timeRange, date } = req.query; // e.g. timeRange=1D, date=2025-10-09

    let match = {};
    let group = {};
    let format = "";

    // If user clicks specific date → return all payments for that date
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      match.createdAt = { $gte: start, $lt: end };

      const payments = await paymentmodel.find(match);
      return res.json({ success: true, details: payments });
    }

    // Time range grouping
    switch (timeRange) {
      case "1H":
        group = {
          _id: { minute: { $minute: "$createdAt" } },
          totalAmount: { $sum: "$finalAmount" },
        };
        format = "%M";
        break;

      case "1D":
        group = {
          _id: { hour: { $hour: "$createdAt" } },
          totalAmount: { $sum: "$finalAmount" },
        };
        format = "%H:00";
        break;

      case "14D":
      case "1M":
        group = {
          _id: { day: { $dayOfMonth: "$createdAt" } },
          totalAmount: { $sum: "$finalAmount" },
        };
        format = "%Y-%m-%d";
        break;

      case "3M":
      case "1Y":
        group = {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          totalAmount: { $sum: "$finalAmount" },
        };
        format = "%b %Y";
        break;
    }

    const stats = await paymentmodel.aggregate([
      { $match: match },
      { $group: group },
      { $sort: { "_id": 1 } }
    ]);

    res.json({ success: true, stats, format });
  } catch (err) {
    console.error("Error fetching payment stats:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
