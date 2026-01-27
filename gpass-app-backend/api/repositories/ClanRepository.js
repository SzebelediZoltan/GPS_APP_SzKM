const { DbError } = require("../errors");
const { Op } = require("sequelize");

class ClanRepository {
    constructor(db) {
        this.Clan = db.Clan;
        this.sequelize = db.sequelize;
    }

    async getClans() {
        try {
            return await this.Clan.scope("public").findAll();
        }
        catch (error) {
            throw new DbError("Failed to fetch clans",
                {
                    details: error.message,
                });
        }
    }

    async getClan(clanId) {
        try {
            return await this.Clan.scope("public").findOne(
                {
                    where:
                    {
                        [Op.or]:
                            [
                                { ID: clanId },
                                { name: clanId }
                            ],
                    },
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch clan",
                {
                    details: error.message,
                    data: clanId,
                });
        }
    }

    async createClan(data) {
        try {
            return await this.Clan.create(data);
        }
        catch (error) {
            throw new DbError("Failed to create clan",
                {
                    details: error.message,
                    data,
                });
        }
    }

    async updateClan(data, clanId) {
        try {
            await this.Clan.update({ ...data },
                {
                    where: { id: clanId }
                });

            return await this.Clan.scope("public").findByPk(clanId);
        }
        catch (error) {
            throw new DbError("Failed to update clan",
                {
                    details: error.message,
                    data: { data, clanId },
                });
        }
    }

    async deleteClan(clanId) {
        try {
            return await this.Clan.destroy(
                {
                    where: { id: clanId }
                });
        }
        catch (error) {
            throw new DbError("Failed to delete clan",
                {
                    details: error.message,
                    data: clanId,
                });
        }
    }

    async searchClans(query) {
        try {
            return await this.Clan.scope("public").findAll(
                {
                    where:
                    {
                        name: { [Op.like]: `%${query}%` }
                    }
                });
        }
        catch (error) {
            throw new DbError("Failed to search clans",
                {
                    details: error.message,
                    data: query,
                });
        }
    }
}

module.exports = ClanRepository;
