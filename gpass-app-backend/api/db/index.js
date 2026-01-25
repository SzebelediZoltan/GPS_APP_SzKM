const { Sequelize } = require("sequelize");

const { DbError } = require("../errors");

const sequelize = new Sequelize
(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,

    {
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,

        logging: false,
    }
);

(async () => 
{
    try
    {
        await sequelize.authenticate();

        console.log("Database connected");
    }
    catch(error)
    {
        throw new DbError("Failed to connect to database", 
        {
            details: error.message
        });
    }
})();

const models = require("../models")(sequelize);

const db = 
{
    sequelize,
    Sequelize,
    ...models,
};

(async () => 
{
    try
    {
        console.log("Database synchronization started");

        await db.sequelize.sync({ alter: true });

        console.log("Database synchronization OK");
    }
    catch(error)
    {
        throw new DbError("Failed to synchronize database", 
        {
            details: error.message
        });
    }
})();

module.exports = db;