const express = require("express")
const { rateLimit, ipKeyGenerator } = require("express-rate-limit")

const router = express.Router()

const contactController = require("../controllers/contactController")
const authMiddleware = require("../middlewares/authMiddleware")
const validate = require("../middlewares/validate")
const rules = require("../middlewares/validationRules")

/* ================= RATE LIMIT ================= */

const guestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1,
  message: {
    message: "Vendégként óránként csak 1 üzenet küldhető.",
  },
  keyGenerator: (req) => `guest_${ipKeyGenerator(req)}`,
})

const userLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1,
  message: {
    message: "10 percenként csak 1 üzenet küldhető.",
  },
  keyGenerator: (req) => `user_${req.user?.ID ?? ipKeyGenerator(req)}`,
})

const dynamicContactLimiter = (req, res, next) => {
  if (!!req.user) {
    return userLimiter(req, res, next)
  } else {
    return guestLimiter(req, res, next)
  }
}

/* ================= ROUTE ================= */

router.post(
  "/",
  authMiddleware.attachUserIfExists,
  dynamicContactLimiter,
  validate(rules.sendContact),
  contactController.sendContactMessage
)

module.exports = router