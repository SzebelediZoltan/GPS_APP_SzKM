class AppError extends Error
{
    constructor(message = "Internal Server Error", 
    { statusCode = 500, isOperational = true, details = undefined, data = undefined } = {}, )
    {
        super(message);

        this.statusCode = statusCode;

        this.isOperational = isOperational;

        this.details = process.env.NODE_ENV !== "production" ? details : undefined;

        this.data = process.env.NODE_ENV !== "production" ? data : undefined;

        process.env.NODE_ENV !== "production" ? Error.captureStackTrace(this, this.constructor) : undefined;
    }
}

module.exports = AppError;