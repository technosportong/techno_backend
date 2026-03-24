const Items = require('../model/Items');
const User = require('../model/User');


// ✅ Add Item
const addItem = async (req, res) => {
  try {
    const { title, model, price, type, userId } = req.body;

    if (!title || !model || !price || !type || !userId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const newItem = new Items({
      title,
      model,
      price,
      type,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
      user: userId,
    });

    const savedItem = await newItem.save();
    res.status(201).json({ message: "Item added", item: savedItem });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Items
const getAllItems = async (req, res) => {
  try {
    const items = await Items.find();

    const formatted = items.map(item => ({
      id: item._id,
      title: item.title,
      model: item.model,
      price: item.price,
      type: item.type,
      image: `data:${item.image.contentType};base64,${item.image.data.toString("base64")}`,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Item
const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Items.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Item (optional image update)
const updateItem = async (req, res) => {
  try {
    const { title, model, price, type } = req.body;
    const updateData = { title, model, price, type };

    if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updatedItem = await Items.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedItem) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Item updated successfully", item: updatedItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addItem, getAllItems, deleteItem, updateItem };