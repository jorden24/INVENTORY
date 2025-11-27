const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

// Register route (updated to hash password and return JWT)
router.post('/register', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ error: 'username and password required' })

    const existing = await User.findOne({ username })
    if (existing) return res.status(409).json({ error: 'username already taken' })

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, password: hash })

    const token = jwt.sign({ user_id: user._id, username: user.username }, JWT_SECRET)
    return res.status(201).json({ user_id: user._id, username: user.username, token })
})

// Login route (updated to verify password and return JWT)
router.post('/login', async (req, res) => {
    const { username, password } = req.body
    if (!username) return res.status(400).json({ error: 'username required' })

    const user = await User.findOne({ username })
    if (!user) return res.status(404).json({ error: 'user not found' })

    const ok = await bcrypt.compare(password || '', user.password || '')
    if (!ok) return res.status(401).json({ error: 'invalid credentials' })

    const token = jwt.sign({ user_id: user._id, username: user.username }, JWT_SECRET)
    return res.json({ user_id: user._id, username: user.username, token })
})

module.exports = router
