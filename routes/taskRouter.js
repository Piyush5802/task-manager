const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { TaskController } = require('../controllers/index');

router.post('/', TaskController.createTask);
router.get('/', TaskController.listTasks);
router.put('/:id/complete', TaskController.completeTask);

module.exports = router;