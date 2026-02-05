const db = require("../db");
const { tripPointService } = require("../services")(db);

exports.getTripPoints = async (req, res, next) => {
    try {
        res.status(200).json(await tripPointService.getTripPoints());
    }
    catch (error) {
        next(error);
    }
}

exports.getTripPoint = async (req, res, next) => {
    const pointId = req.pointID;

    try {
        res.status(200).json(await tripPointService.getTripPoint(pointId));
    }
    catch (error) {
        next(error);
    }
}

exports.createTripPoint = async (req, res, next) => {
    const { trip_id, lat, lng } = req.body || {};

    try {
        res.status(201).json(await tripPointService.createTripPoint({ trip_id, lat, lng }));
    }
    catch (error) {
        next(error);
    }
}

exports.updateTripPoint = async (req, res, next) => {
    const pointId = req.pointID;
    const { lat, lng, recorded_at } = req.body || {};

    try {
        res.status(200).json(await tripPointService.updateTripPoint({ lat, lng, recorded_at }, pointId));
    }
    catch (error) {
        next(error);
    }
}

exports.deleteTripPoint = async (req, res, next) => {
    const pointId = req.pointID;

    try {
        res.status(200).json(await tripPointService.deleteTripPoint(pointId));
    }
    catch (error) {
        next(error);
    }
}

exports.getPointsByTrip = async (req, res, next) => {
    const tripId = req.params?.tripId;

    try {
        res.status(200).json(await tripPointService.getPointsByTrip(tripId));
    }
    catch (error) {
        next(error);
    }
}
