const express = require("express");

const app = express();
const api = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors(
{
    origin: [ "http://localhost:3000" ],
    credentials: true,
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const userRoutes = require("./api/routes/userRoutes");

const errorHandler = require("./api/middlewares/errorHandler");

const authRoutes = require("./api/routes/authRoutes");

app.use("/api", api);

api.use("/users", userRoutes);

api.use("/auth", authRoutes);

api.use(errorHandler.notFound);

app.use(errorHandler.showError);

app.use(errorHandler.notFound);

module.exports = app;