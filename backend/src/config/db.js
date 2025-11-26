const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://hyaasir012_db_user:XkpYmJyjMxj2ZdP7@cluster0.kuqq1zr.mongodb.net/inventory-app?appName=Cluster0'
    )
    console.log("MongoDB connected")
  } catch (err) {
    console.error("DB connection error:", err)
    process.exit(1)
  }
}

module.exports = connectDB
