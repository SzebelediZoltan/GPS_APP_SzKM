const express = require("express")
const rateLimit = require("express-rate-limit")

const router = express.Router()

const contactController = require("../controllers/contactController")
const authMiddleware = require("../middlewares/authMiddleware")

/* ================= RATE LIMIT ================= */

const guestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1,
  message: {
    message: "Vendégként óránként csak 1 üzenet küldhető.",
  },
  keyGenerator: (req) => `guest_${req.ip}`,
})

const userLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1,
  message: {
    message: "10 percenként csak 1 üzenet küldhető.",
  },
  keyGenerator: (req) => `user_${req.user?.ID}`,
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
  contactController.sendContactMessage
)

module.exports = router