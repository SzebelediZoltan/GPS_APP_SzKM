/**
 * Transaction setup/teardown helper for tests
 * Kezeli a Sequelize tranzakciót a tesztek között, hogy az adatok ne szennyezzék egymást.
 */

/**
 * Létrehoz egy új tranzakciót és regisztrálja az app-ban,
 * hogy a teszten belüli összes adatbázis-művelet ugyanabba a tranzakcióba essen.
 * @param {Express.Application} app - Express alkalmazás
 * @param {Sequelize} db - Sequelize database instance
 * @returns {Promise<void>}
 */
const transactionSetup = async (app, db) => {
    const transaction = await db.sequelize.transaction();
    app.set("getTransaction", () => transaction);
};

/**
 * Visszagörget és eltávolítja a tranzakciót a teszt lefutása után,
 * így az adatbázis mindig tiszta állapotból indul a következő teszthez.
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
