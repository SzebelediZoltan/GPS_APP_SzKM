const db = require("../db");
const { tripService } = require("../services")(db);
const transactionBuilder = require("../utilities/transactionBuilder");

exports.getTrips = async (req, res, next) => {
    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await tripService.getTrips({ transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getTrip = async (req, res, next) => {
    const tripId = req.tripID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await tripService.getTrip(tripId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.createTrip = async (req, res, next) => {
    const { user_id, trip_name } = req.body || {};

    try {
        const transaction = transactionBuilder.get(req);
        res.status(201).json(await tripService.createTrip({ user_id, trip_name, transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.updateTrip = async (req, res, next) => {
    const tripId = req.tripID;
    const { user_id, trip_name } = req.body || {};

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await tripService.updateTrip({ user_id, trip_name, transaction }, tripId));
    }
    catch (error) {
        next(error);
    }
}

exports.deleteTrip = async (req, res, next) => {
    const tripId = req.tripID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await tripService.deleteTrip(tripId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getTripByUserAndName = async (req, res, next) => {
    const userId = req.params?.userId || req.userID;
    const tripName = req.params?.tripName;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await tripService.getTripByUserAndName(userId, tripName, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getTripsByUser = async (req, res, next) => {
    const userId = req.params?.userId || req.userID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await tripService.getTripsByUser(userId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}
