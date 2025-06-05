const AuthService = require('../services/authService')

class AuthController{

  async register(req, res, next){
    try {
			await AuthService.register(req, res, next);
		} catch (error) {
			return res.status(500).json({status: false, message: 'error'});
		}
  }

  async login(req, res, next){
    try {
			await AuthService.login(req, res, next);
		} catch (error) {
			return res.status(500).json({status: false, message: 'error'});
		}
  }

}

module.exports = new AuthController();