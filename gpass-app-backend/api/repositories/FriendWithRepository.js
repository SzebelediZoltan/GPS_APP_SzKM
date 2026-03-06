const { DbError } = require("../errors");
const { Op, Association } = require("sequelize");
const User = require("../models/User");

class FriendWithRepository {
    constructor(db) {
        this.FriendWith = db.FriendWith;
        this.sequelize = db.sequelize;
    }

    async getAll(options = {}) {
        try {
            return await this.FriendWith.scope("public").findAll({
                transaction: options.transaction,
            });
        }
        catch (error) {
            throw new DbError("Failed to fetch friend relations",
                {
                    details: error.message,
                    data: { options },
                });
        }
    }

    async getById(id, options = {}) {
        try {
            return await this.FriendWith.findByPk(id, {
                transaction: options.transaction,
            });
        }
        catch (error) {
            throw new DbError("Failed to fetch friend relation",
                {
                    details: error.message,
                    data: { id, options },
                });
        }
    }

    async create(data, options = {}) {
        try {
            return await this.FriendWith.create(data, {
                transaction: options.transaction,
            });
        }
        catch (error) {
            throw new DbError("Failed to create friend relation",
                {
                    details: error.message,
                    data: { data, options },
                });
        }
    }

    async update(data, id, options = {}) {
        try {
            await this.FriendWith.update({ ...data },
                {
                    where: { id },
                    transaction: options.transaction,
                });

            return await this.FriendWith.scope("public").findByPk(id, { transaction: options.transaction });
        }
        catch (error) {
            throw new DbError("Failed to update friend relation",
                {
                    details: error.message,
                    data: { data, id, options },
                });
        }
    }

    async delete(id, options = {}) {
        try {
            return await this.FriendWith.destroy(
                {
                    where: { id },
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to delete friend relation",
                {
                    details: error.message,
                    data: { id, options },
                });
        }
    }

    // hasznos metódusok (repo-szintű lekérdezések)
    async getPendingForUser(userId, options = {}) {
        try {
            return await this.FriendWith.scope("pending").findAll(
                {
                    include: [
                        { association: "sender",
                            attributes: ["ID", "username", "email", "isAdmin"],
                        },

                        { association: "receiver", 
                            attributes: ["ID", "username", "email", "isAdmin"],
                        }
                    ],
                    
                    where: {
                        [Op.or]:
                            [
                                { sender_id: userId },
                                { receiver_id: userId }
                            ]
                    },
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch pending friend requests",
                {
                    details: error.message,
                    data: { userId, options },
                });
        }
    }

    async getAcceptedForUser(userId, options = {}) {
        try {
            return await this.FriendWith.scope("accepted").findAll(
                {
                    
                    
                    include: [
                        { association: "sender", 
                            attributes: ["ID", "username", "email", "isAdmin"],
                        },

                        { association: "receiver" ,
                            attributes: ["ID", "username", "email", "isAdmin"],
                        }
                    ],

                    where: {
                        [Op.or]:
                            [
                                { sender_id: userId },
                                { receiver_id: userId }
                            ]
                    },
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch friends for user",
                {
                    details: error.message,
                    data: { userId, options },
                });
        }
    }
}

module.exports = FriendWithRepository;
