const AppError = require("./AppError");

class DbError extends AppError
{
    constructor(message = "Unexpected database error occured", options = {})
    {
        super(message, { statusCode: 500, isOperational: false, ...options });
    }
}

module.exports = DbError;