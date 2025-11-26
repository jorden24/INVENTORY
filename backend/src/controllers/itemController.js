const Item = require('../models/item')
const Category = require('../models/Category')

exports.getAll = async (req, res) => {
  try {
    const items = await Item.find().populate('category')
    res.status(200).json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.create = async (req, res) => {
  try {
    const { name, categoryId, stock = 100, price = 0 } = req.body
    console.log(req.body);
    const item = await Item.create({ name, category: categoryId || null, stock, price })
    res.status(201).json(item)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}



exports.update = async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) return res.status(404).json({ error: 'Item not found' })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.remove = async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Item not found' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
