const {TaskService} = require('../services/index')

class TaskController{

  async createTask(req, res, next){
    try {
      await TaskService.createTask(req, res, next);
    } catch (error) {
      return res.status(500).json({status: false, message: 'error'});
    }
  }

  async completeTask(req, res, next){
    try {
      await TaskService.completeTask(req, res, next);
    } catch (error) {
      return res.status(500).json({status: false, message: 'error'});
    }
  }

  async listTasks(req, res, next){
    try {
      await TaskService.listTasks(req, res, next);
    } catch (error) {
      return res.status(500).json({status: false, message: 'error'});
    }
  }

}

module.exports = new TaskController();