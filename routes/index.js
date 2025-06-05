const express = require('express');
const router = express.Router();

const authRouter = require('./authRouter');
const taskRouter = require('./taskRouter');
const validateToken = require('../middlewares/authMiddleware')

// Auth Router
router.use('/auth', authRouter);

// Task Router
router.use('/task', validateToken.validateAccessToken, taskRouter);

module.exports = router;