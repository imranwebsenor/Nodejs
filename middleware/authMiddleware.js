const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const secretKey = process.env.JWT_SECRET || 'yourSecretKey';

exports.authMiddleware =()=>{ return(req,res,next)=>{
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
          // console.log('user--------------',user.user[0])
          req.user = user.user[0];
          next();
        }
      });
    }
  }}




exports.authorize =(...roles) =>{
  
  console.log(roles)
  return(req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return next(new ErrorResponse('not authorized',403))
    }
    next();
  }  
}