// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'guest', enum: ['admin', 'worker', 'editor', 'guest'] },
});

const User = mongoose.model('User', userSchema);
module.exports = User;