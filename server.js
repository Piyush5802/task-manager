const express = require('express');
require('dotenv').config();
const app = express();
const indexRouter = require('./routes/index');
require('./services/emailScheduler'); // start cron job

app.use(express.json());
app.use('/api', indexRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));