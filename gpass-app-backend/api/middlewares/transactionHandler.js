const db = require("../db");

// Tesztkörnyezetben minden kérés kap egy Sequelize tranzakciót,
// amit a válasz elküldése után mindig visszagörgetünk.
// Így a tesztadatok nem maradnak az adatbázisban egymás között.
exports.attachTransaction = async (req, res, next) =>
{
    if (process.env.NODE_ENV === "test")
    {
        const t = await db.sequelize.transaction();

        req.transaction = t;

        // Akár sikeresen zárul a kérés, akár megszakad a kapcsolat,
        // garantáltan rollback történik — sosem marad nyitva a tranzakció.
        const cleanupTransaction = async () =>
        {
            if (!req.transaction) return;

            try
            {
                await req.transaction?.rollback();
            }
            catch (_) {}

            req.transaction = undefined;
        };

        res.on("finish", cleanupTransaction);
        res.on("close", cleanupTransaction);
    }

    next();
};
