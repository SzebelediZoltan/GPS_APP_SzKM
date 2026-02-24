const db = require("../db");
const { clanService } = require("../services")(db);

exports.getClans = async (req, res, next) => {
    try {
        res.status(200).json(await clanService.getClans());
    }
    catch (error) {
        next(error);
    }
}

exports.getClan = async (req, res, next) => {
    const clanId = req.clanID;

    try {
        res.status(200).json(await clanService.getClan(clanId));
    }
    catch (error) {
        next(error);
    }
}

exports.createClan = async (req, res, next) => {
    const { name, leader_id, description } = req.body || {};

    try {
        res.status(201).json(await clanService.createClan({ name, leader_id, description }));
    }
    catch (error) {
        next(error);
    }
}

exports.updateClan = async (req, res, next) => {
    const clanId = req.clanID;
    const { name, leader_id, description } = req.body || {};

    try {
        res.status(200).json(await clanService.updateClan({ name, leader_id, description }, clanId));
    }
    catch (error) {
        next(error);
    }
}

exports.deleteClan = async (req, res, next) => {
    const clanId = req.clanID;

    try {
        res.status(200).json(await clanService.deleteClan(clanId));
    }
    catch (error) {
        next(error);
    }
}

exports.searchClans = async (req, res, next) => {
    const query = req.query.query || "";

    try {
        res.status(200).json(await clanService.searchClans(query));
    }
    catch (error) {
        next(error);
    }
}
