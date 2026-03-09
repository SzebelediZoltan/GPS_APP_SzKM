const db = require("../db");
const { clanService } = require("../services")(db);
const transactionBuilder = require("../utilities/transactionBuilder");

exports.getClans = async (req, res, next) => {
    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await clanService.getClans({ transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getClan = async (req, res, next) => {
    const clanId = req.clanID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await clanService.getClan(clanId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.createClan = async (req, res, next) => {
    const { name, leader_id, description } = req.body || {};

    try {
        const transaction = transactionBuilder.get(req);
        res.status(201).json(await clanService.createClan({ name, leader_id, description, transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.updateClan = async (req, res, next) => {
    const clanId = req.clanID;
    const { name, leader_id, description } = req.body || {};

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await clanService.updateClan({ name, leader_id, description, transaction }, clanId));
    }
    catch (error) {
        next(error);
    }
}

exports.deleteClan = async (req, res, next) => {
    const clanId = req.clanID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await clanService.deleteClan(clanId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.searchClans = async (req, res, next) => {
    const query = req.query.query || "";

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await clanService.searchClans(query, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.changeLeader = async (req, res, next) => {
    const clanId = req.clanID;
    const { leader_id } = req.body || {};

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await clanService.changeLeader(leader_id, clanId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}
