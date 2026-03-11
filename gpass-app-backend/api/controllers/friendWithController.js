const db = require("../db");
const { friendWithService } = require("../services")(db);
const transactionBuilder = require("../utilities/transactionBuilder");

exports.getAll = async (req, res, next) => {
    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await friendWithService.getAll({ transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getById = async (req, res, next) => {
    const id = req.friendWithID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await friendWithService.getById(id, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.create = async (req, res, next) => {
    const { sender_id, receiver_id} = req.body || {};

    try {
        const transaction = transactionBuilder.get(req);
        res.status(201).json(await friendWithService.create({ sender_id, receiver_id }, { transaction }));
    }
    catch (error) {
        // console.log(error)
        next(error);
    }
}

exports.update = async (req, res, next) => {
    const id = req.friendWithID;
    const { status } = req.body || {};

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await friendWithService.update({ status }, id, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.delete = async (req, res, next) => {
    const id = req.friendWithID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await friendWithService.delete(id, { transaction }));
    }
    catch (error) {
        // console.log(error)
        next(error);
    }
}

exports.getPendingForUser = async (req, res, next) => {
    const userId = req.params?.userId || req.userID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await friendWithService.getPendingForUser(userId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getAcceptedForUser = async (req, res, next) => {
    const userId = req.params?.userId || req.userID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await friendWithService.getAcceptedForUser(userId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}