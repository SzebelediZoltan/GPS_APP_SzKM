const db = require("../db");
const { friendWithService } = require("../services")(db);

exports.getAll = async (req, res, next) => {
    try {
        res.status(200).json(await friendWithService.getAll());
    }
    catch (error) {
        next(error);
    }
}

exports.getById = async (req, res, next) => {
    const id = req.friendWithID;

    try {
        res.status(200).json(await friendWithService.getById(id));
    }
    catch (error) {
        next(error);
    }
}

exports.create = async (req, res, next) => {
    const { sender_id, receiver_id} = req.body || {};

    try {
        res.status(201).json(await friendWithService.create({ sender_id, receiver_id}));
    }
    catch (error) {
        next(error);
    }
}

exports.update = async (req, res, next) => {
    const id = req.friendWithID;
    const { status } = req.body || {};

    try {
        res.status(200).json(await friendWithService.update({ status }, id));
    }
    catch (error) {
        next(error);
    }
}

exports.delete = async (req, res, next) => {
    const id = req.friendWithID;

    try {
        res.status(200).json(await friendWithService.delete(id));
    }
    catch (error) {
        next(error);
    }
}

exports.getPendingForUser = async (req, res, next) => {
    const userId = req.params?.userId || req.userID;

    try {
        res.status(200).json(await friendWithService.getPendingForUser(userId));
    }
    catch (error) {
        next(error);
    }
}

exports.getAcceptedForUser = async (req, res, next) => {
    const userId = req.params?.userId || req.userID;

    try {
        res.status(200).json(await friendWithService.getAcceptedForUser(userId));
    }
    catch (error) {
        next(error);
    }
}
