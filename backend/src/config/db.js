const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://ftayasin:fta12345@cluster0.peekonz.mongodb.net/INVENTORYSYSTEM?retryWrites=true&w=majority'
    )
    console.log("MongoDB connected")
  } catch (err) {
    console.error("DB connection error:", err)
    process.exit(1)
  }
}

module.exports = connectDB
