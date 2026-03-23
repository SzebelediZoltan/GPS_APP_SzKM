const express = require("express");
const router = express.Router();

const friendWithController = require("../controllers/friendWithController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const rules = require("../middlewares/validationRules");

// minden friend művelet logged in
router.use(authMiddleware.userIsLoggedIn);

// CRUD
router.get("/", authMiddleware.isAdmin, friendWithController.getAll);
router.post("/", validate(rules.createFriend), friendWithController.create);

// PARAM
router.param("id", (req, res, next, id) => {
    req.friendWithID = id;
    next();
});

router.get("/:id", [authMiddleware.isAdmin], friendWithController.getById);
router.put("/:id", validate(rules.updateFriend), friendWithController.update);
router.delete("/:id", friendWithController.delete);

// saját listák
router.get("/pending/:userId", friendWithController.getPendingForUser);
router.get("/accepted/:userId", friendWithController.getAcceptedForUser);

module.exports = router;
