const express = require('express');
const connectDB = require('./config/db');

connectDB();

const app = express();

const PORT = 5000;

//test
//app.get('/', (req, res) => res.send('API running'));

app.use(express.json({ extended: false }));
app.use('/api/otp', require('./routes/api/otp'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
