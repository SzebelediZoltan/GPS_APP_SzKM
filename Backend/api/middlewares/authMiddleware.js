const { UnauthorizedError, ValidationError } = require("../errors");

const authUtils = require("../utilities/authUtils");

exports.userIsLoggedIn = (req, res, next) =>
{
    const { user_token } = req.cookies || {};

    console.log(req.cookies)

    if(!user_token) return next(new UnauthorizedError());

    try
    {
        req.user = authUtils.verifyToken(user_token);
    }
    catch(error)
    {
        return next(new ValidationError("Failed to validate token"));
    }

    next();
}

exports.isAdmin = (req, res, next) =>
{
    if(!req.user.isAdmin) return next(new UnauthorizedError("You do not have the right privileges to access this feature"));

    next();
}