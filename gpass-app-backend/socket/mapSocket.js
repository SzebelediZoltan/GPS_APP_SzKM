const { Server } = require("socket.io")
const cookie = require("cookie")
const authUtils = require("../api/utilities/authUtils")

const BROADCAST_THROTTLE_MS = 3000

// userID → { lat, lng, username, lastSent, hasPosition }
const onlinePositions = new Map()

function initMapSocket(httpServer, allowedOrigins) {
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  })

  // ── Auth middleware ──
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

    // Felvesszük az online map-be pozíció nélkül is — így látható lesz a snapshot-ban
    if (!onlinePositions.has(userID)) {
      onlinePositions.set(userID, { lat: null, lng: null, username, lastSent: 0, hasPosition: false })
    }

    // Broadcast: valaki csatlakozott (pozíció még nincs)
    socket.to("map-room").emit("user:connected", { userID, username })

    // ── Pozíció frissítés ──
    socket.on("position:update", ({ lat, lng }) => {
      if (
        typeof lat !== "number" ||
        typeof lng !== "number" ||
        lat < -90 || lat > 90 ||
        lng < -180 || lng > 180
      ) return

      const now = Date.now()
      const prev = onlinePositions.get(userID)
      if (prev?.hasPosition && now - prev.lastSent < BROADCAST_THROTTLE_MS) return

      onlinePositions.set(userID, { lat, lng, username, lastSent: now, hasPosition: true })

      socket.to("map-room").emit("position:update", { userID, username, lat, lng })
    })

    // ── Snapshot kérés: kliens csatlakozás után kéri az összes online usert ──
    // Csak azokat küldi akiknek már van pozíciójuk
    socket.on("request:online", () => {
      const snapshot = []
      for (const [uid, data] of onlinePositions.entries()) {
        if (uid === userID) continue
        if (!data.hasPosition) continue // pozíció nélkülieket kihagyjuk
        snapshot.push({ userID: uid, username: data.username, lat: data.lat, lng: data.lng })
      }
      if (snapshot.length > 0) {
        socket.emit("online:snapshot", snapshot)
      }
    })

    // ── Lecsatlakozás ──
    socket.on("disconnect", () => {
      console.log(`[socket] lecsatlakozott: ${username} (${userID})`)
      onlinePositions.delete(userID)
      socket.to("map-room").emit("user:disconnected", { userID })
    })
  })

  return io
}

module.exports = { initMapSocket }
