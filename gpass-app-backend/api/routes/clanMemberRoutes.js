const express = require("express");
const router = express.Router();

const clanMemberController = require("../controllers/clanMemberController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const rules = require("../middlewares/validationRules");

// minden klántagság művelet logged in
router.use(authMiddleware.userIsLoggedIn);

// LISTA
router.get("/", authMiddleware.userIsLoggedIn, clanMemberController.getMembers);

// ADD (logged in)
router.post("/", validate(rules.addMember), clanMemberController.addMember);

// lekérések
router.get("/by-clan/:clanId", clanMemberController.getMembersByClan);
router.get("/by-user/:userId", clanMemberController.getMembershipsByUser);

// egy konkrét membership (composite key)
router.get("/:clanId/:userId", clanMemberController.getMember);
router.delete("/:clanId/:userId", clanMemberController.removeMember);

module.exports = router;
