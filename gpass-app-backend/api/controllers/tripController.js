const db = require("../db");
const { tripService } = require("../services")(db);

exports.getTrips = async (req, res, next) => {
    try {
        res.status(200).json(await tripService.getTrips({ transaction: req.app.get("getTransaction")() ?? req.transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getTrip = async (req, res, next) => {
    const tripId = req.tripID;

    try {
        res.status(200).json(await tripService.getTrip(tripId, { transaction: req.app.get("getTransaction")() ?? req.transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.createTrip = async (req, res, next) => {
    const { user_id, trip_name } = req.body || {};

    try {
        res.status(201).json(await tripService.createTrip({ user_id, trip_name, transaction: req.app.get("getTransaction")() ?? req.transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.updateTrip = async (req, res, next) => {
    const tripId = req.tripID;
    const { user_id, trip_name } = req.body || {};

    try {
        res.status(200).json(await tripService.updateTrip({ user_id, trip_name, transaction: req.app.get("getTransaction")() ?? req.transaction }, tripId));
    }
    catch (error) {
        next(error);
    }
}

exports.deleteTrip = async (req, res, next) => {
    const tripId = req.tripID;

    try {
        res.status(200).json(await tripService.deleteTrip(tripId, { transaction: req.app.get("getTransaction")() ?? req.transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getTripByUserAndNumber = async (req, res, next) => {
    const userId = req.params?.userId || req.userID;
    const tripName = req.params?.tripName;

    try {
        res.status(200).json(await tripService.getTripByUserAndNumber(userId, tripName, { transaction: req.app.get("getTransaction")() ?? req.transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getTripsByUser = async (req, res, next) => {
    const userId = req.params?.userId || req.userID;

    try {
        res.status(200).json(await tripService.getTripsByUser(userId, { transaction: req.app.get("getTransaction")() ?? req.transaction }));
    }
    catch (error) {
        next(error);
    }
}
