const Category = require("../models/Category");

exports.getAll = async (req, res) => {
  try {
    const cats = await Category.find();
    res.json(cats);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const cat = await Category.create({ name });
    res.status(201).json(cat);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
