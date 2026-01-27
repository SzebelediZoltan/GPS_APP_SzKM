const db = require("../db");
const { markerService } = require("../services")(db);

exports.getMarkers = async (req, res, next) => {
    try {
        res.status(200).json(await markerService.getMarkers());
    }
    catch (error) {
        next(error);
    }
}

exports.getMarker = async (req, res, next) => {
    const markerId = req.markerID;

    try {
        res.status(200).json(await markerService.getMarker(markerId));
    }
    catch (error) {
        next(error);
    }
}

exports.createMarker = async (req, res, next) => {
    const { creator_id, marker_type, score, lat, lng } = req.body || {};

    try {
        res.status(201).json(await markerService.createMarker({ creator_id, marker_type, score, lat, lng }));
    }
    catch (error) {
        next(error);
    }
}

exports.updateMarker = async (req, res, next) => {
    const markerId = req.markerID;
    const { marker_type, score, lat, lng } = req.body || {};

    try {
        res.status(200).json(await markerService.updateMarker({ marker_type, score, lat, lng }, markerId));
    }
    catch (error) {
        next(error);
    }
}

exports.deleteMarker = async (req, res, next) => {
    const markerId = req.markerID;

    try {
        res.status(200).json(await markerService.deleteMarker(markerId));
    }
    catch (error) {
        next(error);
    }
}

exports.getMarkersByCreator = async (req, res, next) => {
    const userId = req.params?.userId || req.userID;

    try {
        res.status(200).json(await markerService.getMarkersByCreator(userId));
    }
    catch (error) {
        next(error);
    }
}

exports.getMarkersByType = async (req, res, next) => {
    const markerType = req.params?.markerType;

    try {
        res.status(200).json(await markerService.getMarkersByType(markerType));
    }
    catch (error) {
        next(error);
    }
}

exports.getMarkersInBox = async (req, res, next) => {
    const { minLat, maxLat, minLng, maxLng } = req.query || {};
    

    try {
        res.status(200).json(await markerService.getMarkersInBox(minLat, maxLat, minLng, maxLng));
    }
    catch (error) {
        next(error);
    }
}
