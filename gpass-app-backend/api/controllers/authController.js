const bcrypt = require("bcrypt");

const db = require("../db");

const { userService } = require("../services")(db);

const authUtils = require("../utilities/authUtils");
const transactionBuilder = require("../utilities/transactionBuilder");

exports.login = async (req, res, next) => {
    const { userID, password } = req.body;

    let user;

    try {
        const transaction = transactionBuilder.get(req);
        user = await userService.getUserForAuth(userID, { transaction });
    }
    catch (error) {
        return next(error);
    }

    if (await bcrypt.compare(password, user.password)) {
        const token = authUtils.generateUserToken(user);

        authUtils.setCookie(res, "user_token", token);

        res.status(200).json(token);
    }
    else {
        res.status(401).json({ message: "Helytelen jelszó" });
    }
}

exports.status = (req, res, next) => {
    res.status(200).json(req.user);
}

exports.logout = (req, res, next) => {
    res.clearCookie("user_token");

    res.sendStatus(200);
}