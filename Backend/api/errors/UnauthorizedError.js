const AppError = require("./AppError");

class UnauthorizedError extends AppError
{
    constructor(message = "You do not have access to use this feature", options =  {})
    {
        super(message, { statusCode: 401, ...options });
    }
}

module.exports = UnauthorizedError;