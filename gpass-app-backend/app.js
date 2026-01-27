const express = require("express");

const app = express();
const api = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors(
    {
        origin: ["http://localhost:3000", "http://localhost:4173", "http://gpass.site", "https://gpass.site"],
        credentials: true,
    }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/openapi.json');

const userRoutes = require("./api/routes/userRoutes");
const friendWithRoutes = require("./api/routes/friendWithRoutes");
const clanRoutes = require("./api/routes/clanRoutes");
const clanMemberRoutes = require("./api/routes/clanMemberRoutes");
const markerRoutes = require("./api/routes/markerRoutes");
const tripRoutes = require("./api/routes/tripRoutes");
const tripPointRoutes = require("./api/routes/tripPointRoutes");
const authRoutes = require("./api/routes/authRoutes");
const errorHandler = require("./api/middlewares/errorHandler");

app.use("/api", api);

api.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

api.use("/users", userRoutes);
api.use("/auth", authRoutes);

api.use("/friends-with", friendWithRoutes);
api.use("/clans", clanRoutes);
api.use("/clan-members", clanMemberRoutes);
api.use("/markers", markerRoutes);
api.use("/trips", tripRoutes);
api.use("/trip-points", tripPointRoutes);

api.use(errorHandler.notFound);
app.use(errorHandler.showError);
app.use(errorHandler.notFound);

module.exports = app;
