const express = require("express");
const router = express.Router();

const markerController = require("../controllers/markerController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const rules = require("../middlewares/validationRules");

// LISTA (admin)
router.get("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], markerController.getMarkers);

// CREATE (logged in)
router.post("/", [authMiddleware.userIsLoggedIn, ...validate(rules.createMarker)], markerController.createMarker);

// BOX (query) (logged in)
router.get("/box", [authMiddleware.userIsLoggedIn], markerController.getMarkersInBox);

// TÍPUS / LÉTREHOZÓ (logged in)
router.get("/type/:markerType", [authMiddleware.userIsLoggedIn], markerController.getMarkersByType);
router.get("/creator/:userId", [authMiddleware.userIsLoggedIn], markerController.getMarkersByCreator);

// PARAM
router.param("markerID", (req, res, next, markerID) => {
    req.markerID = markerID;
    next();
});

// CRUD 1
router.get("/:markerID", [authMiddleware.userIsLoggedIn], markerController.getMarker);
router.put("/:markerID", [authMiddleware.userIsLoggedIn, ...validate(rules.updateMarker)], markerController.updateMarker);

// DELETE (admin)
router.delete("/:markerID", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], markerController.deleteMarker);

module.exports = router;
