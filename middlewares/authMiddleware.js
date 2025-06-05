const jwt = require('jsonwebtoken');

class validateToken{

  async validateAccessToken(req, res, next){
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, function(err, result){
            if(err){
                console.log(err)
                return res.status(401).json({status: false, message: "Token Expired"})
            }else{
                req.decoded = result;
                next();
            }
        });
  }

}

module.exports = new validateToken();