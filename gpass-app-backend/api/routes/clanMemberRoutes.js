const express = require("express");
const router = express.Router();

const clanMemberController = require("../controllers/clanMemberController");
const authMiddleware = require("../middlewares/authMiddleware");

// minden klántagság művelet logged in
router.use(authMiddleware.userIsLoggedIn);

// LISTA (admin jellegű lehet, de nálad lehet simán engedett)
router.get("/", authMiddleware.isAdmin, clanMemberController.getMembers);

// ADD (logged in)
router.post("/", clanMemberController.addMember);

// lekérések
router.get("/by-clan/:clanId", clanMemberController.getMembersByClan);
router.get("/by-user/:userId", clanMemberController.getMembershipsByUser);

// egy konkrét membership (composite key)
router.get("/:clanId/:userId", clanMemberController.getMember);
router.delete("/:clanId/:userId", clanMemberController.removeMember);

module.exports = router;
