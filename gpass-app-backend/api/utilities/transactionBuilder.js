module.exports = {
    get: (request) =>
    {
        const getTransaction = request?.app?.get("getTransaction");

        if (getTransaction && typeof getTransaction === "function")
        {
            return getTransaction();
        }

        return request?.transaction ?? undefined;
    }
}
