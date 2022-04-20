const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    username: {
        type: String,
    },
    otp: {
        type: Number,
    },
    timestamp: {
        type: Date,
    },
});

module.exports = Otp = mongoose.model('otp', otpSchema);
