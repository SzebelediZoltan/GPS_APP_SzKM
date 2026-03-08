require("dotenv").config(
{
  quiet: true,
  path: "./.env.test",
});

module.exports =
{
  test:
  {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  development:
  {
    username: "root",
    password: null,
    database: "gpass_db",
    host: "localhost",
    dialect: "mysql",
  },
}
