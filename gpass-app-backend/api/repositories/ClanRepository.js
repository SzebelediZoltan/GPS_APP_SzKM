const { DbError } = require("../errors");
const { Op, literal } = require("sequelize");

class ClanRepository {
    constructor(db) {
        this.Clan = db.Clan;
        this.sequelize = db.sequelize;
    }

    async getClans(options = {}) {
        try {
            return await this.Clan.scope("public").findAll({
                attributes: {
                    include: [
                        [
                            literal(`(
                                SELECT COUNT(*)
                                FROM clan_members AS cm
                                WHERE cm.clan_id = \`Clan\`.\`id\`
                            )`),
                            "member_count"
                        ]
                    ]
                },
                include: [
                    {
                        association: "leader",
                        attributes: ["username"],
                        required: false,
                    }
                ],
                transaction: options.transaction,
            });
        }
        catch (error) {
            throw new DbError("Failed to fetch clans",
                {
                    details: error.message,
                    data: { options },
                });
        }
    }

    async getClan(clanId, options = {}) {
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
                    include: [{
                        association: "leader",
                        attributes: ["username", "isAdmin"],
                        required: false,
                    }],
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch clan",
                {
                    details: error.message,
                    data: { clanId, options },
                });
        }
    }

    async createClan(data, options = {}) {
        try {
            return await this.Clan.create(data,
            {
                transaction: options.transaction,
            });
        }
        catch (error) {
            throw new DbError("Failed to create clan",
                {
                    details: error.message,
                    data: { data, options },
                });
        }
    }

    async updateClan(data, clanId, options = {}) {
        try {
            await this.Clan.update({ ...data },
                {
                    where: { id: clanId },
                    transaction: options.transaction,
                });
            return await this.Clan.scope("public").findByPk(clanId, { transaction: options.transaction });
        }
        catch (error) {
            throw new DbError("Failed to update clan",
                {
                    details: error.message,
                    data: { data, clanId, options },
                });
        }
    }

    async deleteClan(clanId, options = {}) {
        try {
            return await this.Clan.destroy(
                {
                    where: { id: clanId },
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to delete clan",
                {
                    details: error.message,
                    data: { clanId, options },
                });
        }
    }

    async searchClans(query, options = {}) {
        try {
            return await this.Clan.scope("public").findAll(
                {
                    where:
                    {
                        name: { [Op.like]: `%${query}%` }
                    },
                    include: [{
                        association: "leader",
                        attributes: ["username"],
                        required: false,
                    }],
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to search clans",
                {
                    details: error.message,
                    data: { query, options },
                });
        }
    }
}

module.exports = ClanRepository;