const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    // For demo purposes we store plain text password — replace with hashing in production
    password: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema)
