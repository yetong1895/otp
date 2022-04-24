const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    username: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    otp: {
        type: String,
    },
    timestamp: {
        type: Date,
    },
});

module.exports = Otp = mongoose.model('otp', otpSchema);
