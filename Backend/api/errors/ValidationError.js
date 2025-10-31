const AppError = require("./AppError");

class ValidationError extends AppError
{
    constructor(message = "Validation error occured", options = {})
    {
        super(message, { statusCode: 403, ...options });
    }
}

module.exports = ValidationError;