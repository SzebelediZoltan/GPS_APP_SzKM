const { DbError } = require("../errors");
const { Op } = require("sequelize");

class FriendWithRepository {
    constructor(db) {
        this.FriendWith = db.FriendWith;
        this.sequelize = db.sequelize;
    }

    async getAll() {
        try {
            return await this.FriendWith.scope("public").findAll();
        }
        catch (error) {
            throw new DbError("Failed to fetch friend relations",
                {
                    details: error.message,
                });
        }
    }

    async getById(id) {
        try {
            return await this.FriendWith.scope("public").findByPk(id);
        }
        catch (error) {
            throw new DbError("Failed to fetch friend relation",
                {
                    details: error.message,
                    data: id,
                });
        }
    }

    async create(data) {
        try {
            return await this.FriendWith.create(data);
        }
        catch (error) {
            throw new DbError("Failed to create friend relation",
                {
                    details: error.message,
                    data,
                });
        }
    }

    async update(data, id) {
        try {
            await this.FriendWith.update({ ...data },
                {
                    where: { id }
                });

            return await this.FriendWith.scope("public").findByPk(id);
        }
        catch (error) {
            throw new DbError("Failed to update friend relation",
                {
                    details: error.message,
                    data: { data, id },
                });
        }
    }

    async delete(id) {
        try {
            return await this.FriendWith.destroy(
                {
                    where: { id }
                });
        }
        catch (error) {
            throw new DbError("Failed to delete friend relation",
                {
                    details: error.message,
                    data: id,
                });
        }
    }

    // hasznos metódusok (repo-szintű lekérdezések)

    async getPendingForUser(userId) {
        try {
            return await this.FriendWith.scope("pending").findAll(
                {
                    where: { receiver_id: userId },
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch pending friend requests",
                {
                    details: error.message,
                    data: userId,
                });
        }
    }

    async getAcceptedForUser(userId) {
        try {
            return await this.FriendWith.scope("accepted").findAll(
                {
                    where:
                    {
                        [Op.or]:
                            [
                                { sender_id: userId },
                                { receiver_id: userId },
                            ]
                    }
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch friends for user",
                {
                    details: error.message,
                    data: userId,
                });
        }
    }
}

module.exports = FriendWithRepository;
