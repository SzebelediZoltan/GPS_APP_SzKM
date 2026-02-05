const db = require("../db");
const { clanMemberService } = require("../services")(db);

exports.getMembers = async (req, res, next) => {
    try {
        res.status(200).json(await clanMemberService.getMembers());
    }
    catch (error) {
        next(error);
    }
}

exports.getMember = async (req, res, next) => {
    const clanId = req.params?.clanId;
    const userId = req.params?.userId;

    try {
        res.status(200).json(await clanMemberService.getMember(clanId, userId));
    }
    catch (error) {
        next(error);
    }
}

exports.addMember = async (req, res, next) => {
    const { clan_id, user_id } = req.body || {};

    try {
        res.status(201).json(await clanMemberService.addMember({ clan_id, user_id }));
    }
    catch (error) {
        next(error);
    }
}

exports.removeMember = async (req, res, next) => {
    const clanId = req.params?.clanId;
    const userId = req.params?.userId;

    try {
        res.status(200).json(await clanMemberService.removeMember(clanId, userId));
    }
    catch (error) {
        next(error);
    }
}

exports.getMembersByClan = async (req, res, next) => {
    const clanId = req.params?.clanId;

    try {
        res.status(200).json(await clanMemberService.getMembersByClan(clanId));
    }
    catch (error) {
        next(error);
    }
}

exports.getMembershipsByUser = async (req, res, next) => {
    const userId = req.params?.userId || req.userID;

    try {
        res.status(200).json(await clanMemberService.getMembershipsByUser(userId));
    }
    catch (error) {
        next(error);
    }
}
