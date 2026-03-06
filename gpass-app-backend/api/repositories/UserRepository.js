const { DbError } = require("../errors");
const { Op } = require("sequelize");

class UserRepository {
    constructor(db) {
        this.User = db.User;
        this.sequelize = db.sequelize;
    }

    async getUsers(options = {}) {
        try {
            return await this.User
                .findAll({ transaction: options.transaction });
        }
        catch (error) {
            throw new DbError("Failed to fetch users",
                {
                    details: error.message,
                    data: { options },
                });
        }
    }

    async getUserForAuth(userID, options = {}) {
        try {
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
                        transaction: options.transaction,
                    });
        }
        catch (error) {
            throw new DbError("Failed to fetch user",
                {
                    details: error.message,
                    data: { userID, options },
                });
        }
    }

    async getUser(userID, options = {}) {
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
                        transaction: options.transaction,
                    });
        }
        catch (error) {
            throw new DbError("Failed to fetch user",
                {
                    details: error.message,
                    data: { userID, options },
                });
        }
    }

    async createUser(userData, options = {}) {
        try {
            return await this.User.create(userData, {
                transaction: options.transaction,
            });
        }
        catch (error) {
            throw new DbError("Failed to create user object",
                {
                    details: error.message,
                    data: { userData, options },
                });
        }
    }

    async deleteUser(userID, options = {}) {
        try {
            return await this.User.destroy(
                {
                    where:
                    {
                        ID: userID,
                    },
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to delete user from database",
                {
                    details: error.message,
                    data: { userID, options },
                });
        }
    }

    async updateUser(userData, userID = userData.ID, options = {}) {
        try {
            await this.User.update(
                { ...userData },
                {
                    where:
                    {
                        ID: userID,
                    },
                    transaction: options.transaction,
                }
            );

            // update után visszaadjuk a friss usert
            return await this.User
                .findByPk(userID, { transaction: options.transaction });
        }
        catch (error) {
            throw new DbError("Failed to update user",
                {
                    details: error.message,
                    data: { userData, userID, options },
                });
        }
    }

    async searchUsers(query, options = {}) {
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
                        transaction: options.transaction,
                    });
        }
        catch (error) {
            throw new DbError("Failed to search users",
                {
                    details: error.message,
                    data: { query, options },
                });
        }
    }

    async updateLocation(userID, latitude, longitude, options = {}) {
        try {
            return await this.User.update(
                {
                    latitude,
                    longitude
                },
                {
                    where: { ID: userID },
                    transaction: options.transaction,
                }
            );

        } catch (error) {
            throw new DbError("Failed to update location",
                {
                    details: error.message,
                    data: {userID, latitude, longitude, options},
                });
        }

    }
    async getUserLocation(userID, options = {}) {

        try {
            return await this.User.findOne({
                where: { ID: userID },
                attributes: ["latitude", "longitude"],
                transaction: options.transaction,
                });

        } catch (error) {
            throw new DbError("Failed to update location",
                {
                    details: error.message,
                    data: {userID, options},
                });     
        }

    }

}

module.exports = UserRepository;
