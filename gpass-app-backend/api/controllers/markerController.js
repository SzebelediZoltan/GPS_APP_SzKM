const db = require("../db");
const { markerService } = require("../services")(db);
const transactionBuilder = require("../utilities/transactionBuilder");

exports.getMarkers = async (req, res, next) => {
    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await markerService.getMarkers({ transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getMarker = async (req, res, next) => {
    const markerId = req.markerID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await markerService.getMarker(markerId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.createMarker = async (req, res, next) => {
    const { creator_id, marker_type, lat, lng } = req.body || {};

    try {
        const transaction = transactionBuilder.get(req);
        res.status(201).json(await markerService.createMarker({ creator_id, marker_type, lat, lng }, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.updateMarker = async (req, res, next) => {
    const markerId = req.markerID;
    const { marker_type, score, lat, lng } = req.body || {};

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await markerService.updateMarker({ marker_type, score, lat, lng }, markerId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.deleteMarker = async (req, res, next) => {
    const markerId = req.markerID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await markerService.deleteMarker(markerId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getMarkersByCreator = async (req, res, next) => {
    const userId = req.params?.userId || req.userID;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await markerService.getMarkersByCreator(userId, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getMarkersByType = async (req, res, next) => {
    const markerType = req.params?.markerType;

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await markerService.getMarkersByType(markerType, { transaction }));
    }
    catch (error) {
        next(error);
    }
}

exports.getMarkersInBox = async (req, res, next) => {
    const { minLat, maxLat, minLng, maxLng } = req.query || {};

    try {
        const transaction = transactionBuilder.get(req);
        res.status(200).json(await markerService.getMarkersInBox(minLat, maxLat, minLng, maxLng, { transaction }));
    }
    catch (error) {
        next(error);
    }
}