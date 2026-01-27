const { DbError } = require("../errors");
const { Op } = require("sequelize");

class UserRepository {
    constructor(db) {
        this.User = db.User;
        this.sequelize = db.sequelize;
    }

    async getUsers() {
        try {
            return await this.User
                .findAll();
        }
        catch (error) {
            throw new DbError("Failed to fetch users",
                {
                    details: error.message,
                });
        }
    }

    async getUserForAuth(userID) {
        try {
            console.log(userID)
            return await this.User
                .scope("auth")
                .findOne(
                    {
                        where:
                        {
                            [Op.or]:
                                [
                                    { ID: userID },
                                    { username: userID },
                                    { email: userID },
                                ],
                        },
                    });
        }
        catch (error) {
            throw new DbError("Failed to fetch user",
                {
                    details: error.message,
                    data: userID,
                });
        }
    }

    async getUser(userID) {
        try {
            return await this.User
                .scope("public")
                .findOne(
                    {
                        where:
                        {
                            [Op.or]:
                                [
                                    { ID: userID },
                                    { username: userID },
                                    { email: userID },
                                ],
                        },
                    });
        }
        catch (error) {
            throw new DbError("Failed to fetch user",
                {
                    details: error.message,
                    data: userID,
                });
        }
    }

    async createUser(userData) {
        try {
            return await this.User.create(userData);
        }
        catch (error) {
            throw new DbError("Failed to create user object",
                {
                    details: error.message,
                    data: userData,
                });
        }
    }

    async deleteUser(userID) {
        try {
            return await this.User.destroy(
                {
                    where:
                    {
                        ID: userID,
                    },
                });
        }
        catch (error) {
            throw new DbError("Failed to delete user from database",
                {
                    details: error.message,
                    data: { userID },
                });
        }
    }

    async updateUser(userData, userID = userData.ID) {
        try {
            await this.User.update(
                { ...userData },
                {
                    where:
                    {
                        ID: userID,
                    },
                }
            );

            // update után visszaadjuk a friss usert
            return await this.User
                .findByPk(userID);
        }
        catch (error) {
            throw new DbError("Failed to update user",
                {
                    details: error.message,
                    data: { userData, userID },
                });
        }
    }

    async searchUsers(query) {
        try {
            return await this.User
                .scope("public")
                .findAll(
                    {
                        where:
                        {
                            [Op.or]:
                                [
                                    { username: { [Op.like]: `%${query}%` } },
                                    { email: { [Op.like]: `%${query}%` } },
                                ],
                        },
                    });
        }
        catch (error) {
            throw new DbError("Failed to search users",
                {
                    details: error.message,
                    data: query,
                });
        }
    }
}

module.exports = UserRepository;
