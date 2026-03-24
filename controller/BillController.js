const Bill = require("../model/Bill");

// Create Bill
const createBill = async (req, res) => {
  try {
    const {
      items,
      discountPercent,
      totalAmount,
      discountAmount,
      netAmount,
      visitTime,
      payment,
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "Bill must have at least one item." });
    }

    // ✅ Payment validation
    if (!payment || payment.cash + payment.upi !== netAmount) {
      return res.status(400).json({
        message: "Cash + UPI must equal Net Amount",
      });
    }

    const now = new Date();

    // ✅ START & END OF TODAY
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // ✅ COUNT TODAY'S BILLS
    const count = await Bill.countDocuments({
      visitTime: { $gte: startOfDay, $lte: endOfDay },
    });

    const nextNumber = count + 1;

    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");

    const billNumber = `TS-${dateStr}-${String(nextNumber).padStart(3, "0")}`;

    // ✅ SAVE
    const bill = new Bill({
      billNumber,
      items,
      discountPercent: discountPercent || 0,
      totalAmount,
      discountAmount: discountAmount || 0,
      netAmount,
      payment,
      visitTime: visitTime ? new Date(visitTime) : new Date(),
    });

    await bill.save();

    res.status(201).json({
      message: "Bill saved successfully",
      bill,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all bills
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ visitTime: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Daily totals
const getDailyTotals = async (req, res) => {
  try {
    const dailyTotals = await Bill.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$visitTime" } },
          totalAmount: { $sum: "$totalAmount" },
          netAmount: { $sum: "$netAmount" },
          billCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(dailyTotals);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET NEXT BILL NUMBER (PREVIEW)
const getNextBillNumber = async (req, res) => {
  try {
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const count = await Bill.countDocuments({
      visitTime: { $gte: startOfDay, $lte: endOfDay },
    });

    const nextNumber = count + 1;

    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const billNumber = `TS-${dateStr}-${String(nextNumber).padStart(3, "0")}`;

    res.json({ billNumber });
  } catch (err) {
    res.status(500).json({ message: "Error generating bill number" });
  }
};

module.exports = {
  createBill,
  getAllBills,
  getDailyTotals,
  getNextBillNumber
};