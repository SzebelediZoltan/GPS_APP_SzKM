/**
 * Transaction setup/teardown helper for tests
 * Kezeli a Sequelize transaction-t a teszt során
 */

/**
 * Beállítja a transaction-t és regisztrálja az app-ban
 * @param {Express.Application} app - Express alkalmazás
 * @param {Sequelize} db - Sequelize database instance
 * @returns {Promise<void>}
 */
const transactionSetup = async (app, db) => {
    const transaction = await db.sequelize.transaction();
    app.set("getTransaction", () => transaction);
};

/**
 * Felszággitja és karbantartja a transaction-t
 * @param {Express.Application} app - Express alkalmazás
 * @returns {Promise<void>}
 */
const transactionTeardown = async (app) => {
    const getTransaction = app.get("getTransaction");
    
    if (getTransaction && typeof getTransaction === "function") {
        const transaction = getTransaction();
        if (transaction) {
            await transaction.rollback();
        }
    }
    
    app.set("getTransaction", undefined);
};

module.exports = {
    transactionSetup,
    transactionTeardown,
};
