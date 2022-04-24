const express = require('express');
const router = express.Router();
const Otp = require('../../Model/Otp');

// @route   POST api/otp/generateOTP
// @desc    Generate an OTP base on user phone number, timestamp and a random number
// @access  Public
router.post('/generateOTP', async (req, res) => {
    try {
        const timestamp = new Date().getTime();
        var otp = String(
            (
                (req.body.phoneNumber + timestamp + Math.random()) %
                1000000
            ).toFixed()
        ).padStart(6, '0'); //otp now made up of phoneNumber, timestamp and a random number to increase uniqueness

        const Data = {
            username: req.body.username,
            phoneNumber: req.body.phoneNumber,
            otp: otp,
            timestamp: timestamp,
        };

        const findUser = await Otp.findOne({ username: req.body.username });
        if (findUser) {
            await Otp.findOneAndUpdate({ username: req.body.username }, Data);
        } else {
            var database = Otp(Data);
            await database.save();
        }
        res.send(otp);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/otp/verifyOTP
// @desc    Verify user OTP
// @access  Public
router.get('/verifyOTP', async (req, res) => {
    try {
        const timestamp = new Date().getTime();
        //{a ,b, c} = request.body
        const findUser = await Otp.findOne({ username: req.body.username });
        if (!findUser) {
            res.status(404).send('Please login');
        } else if ((timestamp - findUser.timestamp) / 1000 > 600) {
            await Otp.deleteOne({ username: req.body.username });
            res.status(400).send('OTP expired');
        } else if (req.body.otp != findUser.otp) {
            res.status(400).send('Please enter a valid OTP');
        } else {
            await Otp.deleteOne({ username: req.body.username });
            res.send('verification completed');
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
