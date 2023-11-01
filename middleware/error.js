const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    let error = {...err};
    
    error.message =err.message
    if(err.name=='CastError'){
        let message = `Resource not found wih ID ${err.value}`;
        error = new ErrorResponse(message,404);
    }
    if(err.name=="ValidationError"){
        let validation={}
        let errors={...err.errors}
        for (const key of Object.keys(errors)) {
            validation[key] =  errors[key].properties.message
        }
        res.status(error.statusCode || 500).json({
            success: false,
            errors: validation
        });
        return;

    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message 
    });
};

module.exports = { errorHandler };