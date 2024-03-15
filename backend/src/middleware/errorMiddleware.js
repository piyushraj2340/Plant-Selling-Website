const errorHandlerMiddleware = (err, req, res, next) => {
    console.error(err.stack);

    let statusCode = err.status || 500;
    let message = err.message || 'Internal Server Error';

    //TODO: Add All the cases of error such as: mongodb, jwt, and all.

    const info = {
        status: false,
        message
    }

    res.status(statusCode).json(info);
};

module.exports = errorHandlerMiddleware;
