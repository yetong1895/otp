const express = require('express');
const router = express.Router();
const Otp = require('../../Model/Otp');

//generateOTP
router.post('/generateOTP', async (req, res) => {
    try {
        console.log(req.body);
        const timestamp = new Date().getTime() / 1000;
        const otp = (timestamp % 999999).toFixed(); //000001
        const Data = {
            username: req.body.username,
            otp: otp,
            timestamp: timestamp,
        };

        const findUser = await Otp.findOne({ username: req.body.username });
        if (findUser) {
            await Otp.findOneAndUpdate(Data);
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

//verifyOTP
router.get('/verifyOTP', async (req, res) => {
    try {
        const timestamp = new Date().getTime() / 1000;
        //{a ,b, c} = request.body
        const username2 = req.body.username;
        const findUser = await Otp.findOne({ username: req.body.username });
        if (!findUser) {
            res.status(404).send('Please login');
        } else if (timestamp - findUser.timestamp > 600) {
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
