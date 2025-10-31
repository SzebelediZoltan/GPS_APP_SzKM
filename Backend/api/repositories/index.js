const UserRepository = require("./UserRepository");

module.exports = (db) =>
{
    const userRepository = new UserRepository(db);

    return { userRepository };
}