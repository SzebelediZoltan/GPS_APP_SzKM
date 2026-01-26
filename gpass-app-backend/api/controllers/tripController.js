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
    const tripId = req.params?.id;

    try {
        res.status(200).json(await tripService.getTrip(tripId));
    }
    catch (error) {
        next(error);
    }
}

exports.createTrip = async (req, res, next) => {
    const { user_id, trip_number } = req.body || {};

    try {
        res.status(201).json(await tripService.createTrip({ user_id, trip_number }));
    }
    catch (error) {
        next(error);
    }
}

exports.updateTrip = async (req, res, next) => {
    const tripId = req.params?.id;
    const { user_id, trip_number } = req.body || {};

    try {
        res.status(200).json(await tripService.updateTrip({ user_id, trip_number }, tripId));
    }
    catch (error) {
        next(error);
    }
}

exports.deleteTrip = async (req, res, next) => {
    const tripId = req.params?.id;

    try {
        res.status(200).json(await tripService.deleteTrip(tripId));
    }
    catch (error) {
        next(error);
    }
}

exports.getTripByUserAndNumber = async (req, res, next) => {
    const userId = req.params?.userId || req.userID;
    const tripNumber = req.params?.tripNumber;

    try {
        res.status(200).json(await tripService.getTripByUserAndNumber(userId, tripNumber));
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
