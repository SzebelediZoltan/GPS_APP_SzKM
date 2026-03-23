const db = require("../db");
const { userService } = require("../services")(db);
const authUtils = require('../utilities/authUtils');
const transactionBuilder = require("../utilities/transactionBuilder");

exports.getUsers = async (req, res, next) => {
    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await userService.getUsers({ transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getUser = async (req, res, next) => {
    const userID = req.userID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await userService.getUser(userID, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.createUser = async (req, res, next) => {
    const { username, email, password } = req.body || {};

    try {
        const transaction = transactionBuilder.get(req);
        res.status(201).json(await userService.createUser({ username, email, password }, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.updateUser = async (req, res, next) => {
    const userID = req.userID;
    const { username, email, password, isAdmin, status } = req.body || {};

    try {
        const transaction = transactionBuilder.get(req);
        const newUser = await userService.updateUser({ username, email, password, isAdmin, status }, userID, { transaction });

        const newToken = authUtils.generateUserToken({
            ID: userID,
            username,
            isAdmin,
            email
        });

        authUtils.setCookie(res, "user_token", newToken);

        res.status(200).json(newUser);
    }
    catch (error) {
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    const userID = req.userID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await userService.deleteUser(userID, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.searchUsers = async (req, res, next) => {
    const query = req.query.query || "";

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await userService.searchUsers(query, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.updateLocation = async (req, res, next) => {
    const { latitude, longitude } = req.body;
    const userID = req.user.userID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await userService.updateUserLocation(userID, latitude, longitude, { transaction }));
    }
    catch (error) {
        next(error);
    }
};

exports.getUserLocation = async (req, res, next) => {
    const userID = req.userID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await userService.getUserLocation(userID, { transaction }));
    }
    catch (error) {
        next(error);
    }
};