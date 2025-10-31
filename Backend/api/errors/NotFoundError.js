const AppError = require("./AppError");

class NotFoundError extends AppError
{
    constructor(message = "The specified resource can not be found", options = {})
    {
        super(message, { statusCode: 404, isOperational: true, ...options });
    }
}

module.exports = NotFoundError;