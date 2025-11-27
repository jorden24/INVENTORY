const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://ftayasin:fta12345@cluster0.peekonz.mongodb.net/INVENTORYSYSTEM?retryWrites=true&w=majority'
    )
    console.log("MongoDB connected")
  } catch (err) {
    console.error("DB connection error:", err)
    // Do NOT exit the process here. In development we want the server to remain up so
    // frontend fetch/CORS issues can be diagnosed even if the DB is unavailable.
    // If you want to fail fast in production, handle that via environment checks.
  }
}

module.exports = connectDB
