const router = require("express").Router();
const multer = require("multer");
const ItemsController = require("../controller/ItemsController");

// ✅ multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/add", upload.single("image"), ItemsController.addItem);
router.get("/get", ItemsController.getAllItems);
router.delete("/delete/:id", ItemsController.deleteItem);
router.put("/update/:id", upload.single("image"), ItemsController.updateItem);

module.exports = router;