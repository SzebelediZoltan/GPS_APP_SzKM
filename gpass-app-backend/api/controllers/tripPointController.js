const db = require("../db");
const { tripPointService } = require("../services")(db);
const transactionBuilder = require("../utilities/transactionBuilder");

exports.getTripPoints = async (req, res, next) => {
    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await tripPointService.getTripPoints({ transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getTripPoint = async (req, res, next) => {
    const pointId = req.pointID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await tripPointService.getTripPoint(pointId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.createTripPoint = async (req, res, next) => {
    const { trip_id, lat, lng } = req.body || {};

    try {
        const transaction = transactionBuilder.get(req);
        res.status(201).json(await tripPointService.createTripPoint({ trip_id, lat, lng, transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.updateTripPoint = async (req, res, next) => {
    const pointId = req.pointID;
    const { lat, lng, recorded_at } = req.body || {};

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await tripPointService.updateTripPoint({ lat, lng, recorded_at, transaction }, pointId));
    }
    catch (error) {
        next(error);
    }
}

exports.deleteTripPoint = async (req, res, next) => {
    const pointId = req.pointID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await tripPointService.deleteTripPoint(pointId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getPointsByTrip = async (req, res, next) => {
    const tripId = req.params?.tripId;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await tripPointService.getPointsByTrip(tripId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}
