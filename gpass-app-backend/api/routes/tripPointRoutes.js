const express = require("express");
const router = express.Router();

const tripPointController = require("../controllers/tripPointController");
const authMiddleware = require("../middlewares/authMiddleware");

// minden pont művelet logged in
router.use(authMiddleware.userIsLoggedIn);

// LISTA (admin jellegű lehet)
router.get("/", tripPointController.getTripPoints);

// adott trip pontjai (időrendben)
router.get("/by-trip/:tripId", tripPointController.getPointsByTrip);

// CREATE
router.post("/", tripPointController.createTripPoint);

// PARAM
router.param("pointID", (req, res, next, pointID) => {
    req.pointID = pointID;
    next();
});

// CRUD 1
router.get("/:pointID", tripPointController.getTripPoint);
router.put("/:pointID", tripPointController.updateTripPoint);

// DELETE (admin)
router.delete("/:pointID", [authMiddleware.isAdmin], tripPointController.deleteTripPoint);

module.exports = router;
