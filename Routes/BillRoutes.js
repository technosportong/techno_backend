const express = require("express");
const router = express.Router();
const BillController = require("../controller/BillController");

router.post("/add", BillController.createBill);
router.get("/get", BillController.getAllBills);
router.get("/daily-totals", BillController.getDailyTotals);
router.get("/next-bill-number", BillController.getNextBillNumber);
module.exports = router;