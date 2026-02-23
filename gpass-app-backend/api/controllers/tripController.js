const db = require("../db");
const { tripService } = require("../services")(db);

exports.getTrips = async (req, res, next) => {
    try {
        res.status(200).json(await tripService.getTrips());
    }
    catch (error) {
        next(error);
    }
}

exports.getTrip = async (req, res, next) => {
    const tripId = req.tripID;

    try {
        res.status(200).json(await tripService.getTrip(tripId));
    }
    catch (error) {
        next(error);
    }
}

exports.createTrip = async (req, res, next) => {
    const { user_id, trip_name } = req.body || {};

    try {
        res.status(201).json(await tripService.createTrip({ user_id, trip_name }));
    }
    catch (error) {
        next(error);
    }
}

exports.updateTrip = async (req, res, next) => {
    const tripId = req.tripID;
    const { user_id, trip_name } = req.body || {};

    try {
        res.status(200).json(await tripService.updateTrip({ user_id, trip_name }, tripId));
    }
    catch (error) {
        next(error);
    }
}

exports.deleteTrip = async (req, res, next) => {
    const tripId = req.tripID;

    try {
        res.status(200).json(await tripService.deleteTrip(tripId));
    }
    catch (error) {
        next(error);
    }
}

exports.getTripByUserAndNumber = async (req, res, next) => {
    const userId = req.params?.userId || req.userID;
    const tripName = req.params?.tripName;

    try {
        res.status(200).json(await tripService.getTripByUserAndNumber(userId, tripName));
    }
    catch (error) {
        next(error);
    }
}

exports.getTripsByUser = async (req, res, next) => {
    const userId = req.params?.userId || req.userID;

    try {
        res.status(200).json(await tripService.getTripsByUser(userId));
    }
    catch (error) {
        next(error);
    }
}
