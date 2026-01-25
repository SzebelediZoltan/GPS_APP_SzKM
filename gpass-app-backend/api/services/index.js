const UserService = require("./UserService")

module.exports = (db) =>
{
    const userService = new UserService(db);

    return { userService };
}