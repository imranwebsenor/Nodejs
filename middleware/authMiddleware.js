const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'yourSecretKey';

module.exports = async function(req,res,next){
    let token = req.header('Authorization');
    if(!token){
      res.status(403).json("unauthenticated")

    }
    else
    {

    
      token = token.split(" ");
      token = token[1];
      jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          return res.status(403).json("unauthenticated ----");
          return true;
           
        }
        // Assign the user to req.user when verification is successful
        else
        {

          req.user = user;
          next();
        }
      });
    }
  }