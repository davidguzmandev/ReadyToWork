const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Añade otros campos que necesites
});

module.exports = mongoose.model('Client', clientSchema);