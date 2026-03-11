const { Server } = require("socket.io")
const cookie = require("cookie")
const authUtils = require("../api/utilities/authUtils")

const lastBroadcast = new Map()
const BROADCAST_THROTTLE_MS = 3000

function initMapSocket(httpServer, allowedOrigins) {
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  })

  io.use((socket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie || ""
      const parsed = cookie.parse(rawCookie)
      const token = parsed.user_token

      if (!token) return next(new Error("Nincs token."))

      const user = authUtils.verifyToken(token)
      if (!user) return next(new Error("Érvénytelen token."))

      socket.user = user
      next()
    } catch (err) {
      next(new Error("Auth hiba: " + err.message))
    }
  })

  io.on("connection", (socket) => {
    const { userID, username } = socket.user

    console.log(`[socket] csatlakozott: ${username} (${userID})`)

    socket.join("map-room")

    socket.to("map-room").emit("user:connected", { userID, username })

    socket.on("position:update", ({ lat, lng }) => {
      if (
        typeof lat !== "number" ||
        typeof lng !== "number" ||
        lat < -90 || lat > 90 ||
        lng < -180 || lng > 180
      ) return

      const now = Date.now()
      const last = lastBroadcast.get(userID) || 0
      if (now - last < BROADCAST_THROTTLE_MS) return
      lastBroadcast.set(userID, now)

      socket.to("map-room").emit("position:update", {
        userID,
        username,
        lat,
        lng,
      })
    })

    socket.on("disconnect", () => {
      console.log(`[socket] lecsatlakozott: ${username} (${userID})`)
      lastBroadcast.delete(userID)
      socket.to("map-room").emit("user:disconnected", { userID })
    })
  })

  return io
}

module.exports = { initMapSocket }
