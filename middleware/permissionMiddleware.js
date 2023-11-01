const permissions = require('../permissions/permissions');
const roles = require('../config/roles');
const { json } = require('body-parser');


module.exports = async function(req,res,next){
    
    // console.log('-------++++++++++++++++++++++++==',req.user.user[0].role);
    if(req.user.user[0].role==roles.ROLES.ADMIN){
        next();
    }else{
        res.status(403).json({'message':"no permission"});
    }
}