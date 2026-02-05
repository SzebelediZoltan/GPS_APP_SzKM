const { NotFoundError, AppError } = require("../errors");

function notFound(req, res, next)
{
    next(new NotFoundError());
}

function showError(error, req, res, next)
{
    const stack = error.stack;

    if(!(error instanceof AppError))
    {
        error = new AppError("Internal Server Error", 
        {
            isOperational: false,
        });
    }

    error.stack = stack;

    res.status(error.statusCode).json(
    {
        message: error.message,
        ...error,
        stack: error.stack ?? undefined,
    });
}

module.exports = { notFound, showError };
