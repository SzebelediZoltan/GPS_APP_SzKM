const express = require("express");
const router = express.Router();

const tripController = require("../controllers/tripController");
const authMiddleware = require("../middlewares/authMiddleware");

// minden trip művelet logged in
router.use(authMiddleware.userIsLoggedIn);

// LISTA
router.get("/", tripController.getTrips);

// user tripjei
router.get("/by-user/:userId", tripController.getTripsByUser);

// user + tripNumber
router.get("/by-user/:userId/number/:tripNumber", tripController.getTripByUserAndNumber);

// CREATE
router.post("/", tripController.createTrip);

// PARAM
router.param("tripID", (req, res, next, tripID) => {
    req.tripID = tripID;
    next();
});

// CRUD 1
router.get("/:tripID", tripController.getTrip);
router.put("/:tripID", tripController.updateTrip);

// DELETE (admin)
router.delete("/:tripID", [authMiddleware.isAdmin], tripController.deleteTrip);

module.exports = router;
