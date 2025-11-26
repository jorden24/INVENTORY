const Item = require("../models/item");
const Category = require("../models/Category");
const mongoose = require("mongoose");

exports.getAll = async (req, res) => {
  try {
    const items = await Item.find().populate("category");
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, categoryId, category, stock = 100, price = 0 } = req.body;
    console.log("Create item payload:", req.body);

    let categoryRef = null;

    if (categoryId) {
      categoryRef = categoryId;
    } else if (category) {
      // If category looks like an ObjectId, use it directly
      if (mongoose.Types.ObjectId.isValid(category)) {
        categoryRef = category;
      } else {
        // Otherwise find or create the category by name
        let catDoc = await Category.findOne({ name: category });
        if (!catDoc) catDoc = await Category.create({ name: category });
        categoryRef = catDoc._id;
      }
    }

    const item = await Item.create({
      name,
      category: categoryRef || null,
      stock,
      price,
    });
    res.status(201).json(item);
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Item not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Item not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
