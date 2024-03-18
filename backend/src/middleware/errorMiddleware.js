const errorHandlerMiddleware = (err, req, res, next) => {
    console.error(err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if(err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
        message = "Authentication Failed";
        statusCode = 401;
    } 

    //TODO: Add All the cases of error such as: mongodb, jwt, and all.

    const info = {
        status: false,
        message
    }

    res.status(statusCode).json(info);
};

module.exports = errorHandlerMiddleware;
