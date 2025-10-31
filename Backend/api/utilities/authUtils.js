const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const salt = 14;

exports.generateUserToken = (user) =>
{
    return jwt.sign({ userID: user.ID, username: user.name, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
}

exports.setCookie = (res, cookieName, value) =>
{
    res.cookie(cookieName, value, 
    {
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // 1 hr
        secure: process.env.NODE_ENV == "production",
        sameSite: "none",
    });
}

exports.verifyToken = (token) =>
{
    try
    {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    catch(error)
    {
        return null;
    }
}

exports.hashPassword = (password) =>
{
    return bcrypt.hashSync(password, salt);
}