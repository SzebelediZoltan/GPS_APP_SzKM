const db = require("../db");

exports.attachTransaction = async (req, res, next) =>
{
    if (process.env.NODE_ENV === "test")
    {
        const t = await db.sequelize.transaction();

        req.transaction = t;

        const cleanupTransaction = async () =>
        {
            if (!req.transaction) return;

            try
            {
                await req.transaction?.rollback();
            }
            catch (_) {};

            req.transaction = undefined;
        };

        res.on("finish", cleanupTransaction);
        res.on("close", cleanupTransaction);
    }

    next();
};