const express = require("express");
const router = express.Router();

const markerController = require("../controllers/markerController");
const authMiddleware = require("../middlewares/authMiddleware");

// LISTA (logged in)
router.get("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], markerController.getMarkers);

// BOX (query) (logged in)
router.get("/box", [authMiddleware.userIsLoggedIn], markerController.getMarkersInBox);

// TÍPUS / LÉTREHOZÓ (logged in)
router.get("/type/:markerType", [authMiddleware.userIsLoggedIn], markerController.getMarkersByType);
router.get("/creator/:userId", [authMiddleware.userIsLoggedIn], markerController.getMarkersByCreator);

// CREATE (logged in)
router.post("/", [authMiddleware.userIsLoggedIn], markerController.createMarker);

// PARAM
router.param("markerID", (req, res, next, markerID) => {
    req.markerID = markerID;
    next();
});

// CRUD 1
router.get("/:markerID", [authMiddleware.userIsLoggedIn], markerController.getMarker);
router.put("/:markerID", [authMiddleware.userIsLoggedIn], markerController.updateMarker);

// DELETE (admin) – ha nálad csak creator törölhet, azt majd service-ben
router.delete("/:markerID", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], markerController.deleteMarker);

module.exports = router;
