const AppError = require("./AppError");

class BadRequestError extends AppError
{
    constructor(message = "Bad request", options = {})
    {
        super(message, { statusCode: 400, ...options });
    }
}

module.exports = BadRequestError;