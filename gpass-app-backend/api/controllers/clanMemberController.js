const db = require("../db");
const { clanMemberService } = require("../services")(db);
const transactionBuilder = require("../utilities/transactionBuilder");

exports.getMembers = async (req, res, next) => {
    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await clanMemberService.getMembers({ transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getMember = async (req, res, next) => {
    const clanId = req.params?.clanId;
    const userId = req.params?.userId;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await clanMemberService.getMember(clanId, userId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.addMember = async (req, res, next) => {
    const { clan_id, user_id } = req.body || {};

    try {
        const transaction = transactionBuilder.get(req);
        res.status(201).json(await clanMemberService.addMember({ clan_id, user_id }, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.removeMember = async (req, res, next) => {
    const clanId = req.params?.clanId;
    const userId = req.params?.userId;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await clanMemberService.removeMember(clanId, userId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getMembersByClan = async (req, res, next) => {
    const clanId = req.params?.clanId;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await clanMemberService.getMembersByClan(clanId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getMembershipsByUser = async (req, res, next) => {
    const userId = req.params?.userId || req.userID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await clanMemberService.getMembershipsByUser(userId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}