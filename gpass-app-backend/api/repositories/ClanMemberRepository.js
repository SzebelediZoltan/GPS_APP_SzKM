const { where } = require("sequelize");
const { DbError } = require("../errors");

class ClanMemberRepository {
    constructor(db) {
        this.ClanMember = db.ClanMember;
        this.sequelize = db.sequelize;
    }

    async getMembers(options = {}) {
        try {
            return await this.ClanMember.scope("public").findAll({
                include: [
                    {association: "user", attributes: ["id", "username", "isAdmin"]},
                    {association: "clan"}
                ],
                transaction: options.transaction,
            });
        }
        catch (error) {
            throw new DbError("Failed to fetch clan members",
                {
                    details: error.message,
                    data: { options },
                });
        }
    }

    async getMember(clanId, userId, options = {}) {
        try {
            return await this.ClanMember.scope("public").findOne(
                {
                    where:
                    {
                        clan_id: clanId,
                        user_id: userId,
                    },
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch clan member",
                {
                    details: error.message,
                    data: { clanId, userId, options },
                });
        }
    }

    async addMember(data, options = {}) {
        console.log("Adding clan member:", data);
        
        try {
            return await this.ClanMember.create(data,
            {
                transaction: options.transaction,
            });
        }
        catch (error) {
            throw new DbError("Failed to add clan member",
                {
                    details: error.message,
                    data: { data, options },
                });
        }
    }

    async removeMember(clanId, userId, options = {}) {
        try {
            return await this.ClanMember.destroy(
                {
                    where:
                    {
                        clan_id: clanId,
                        user_id: userId,
                    },
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to remove clan member",
                {
                    details: error.message,
                    data: { clanId, userId, options },
                });
        }
    }

    async getMembersByClan(clanId, options = {}) {
        try {
            return await this.ClanMember.scope("public").findAll(
                {
                    where: { clan_id: clanId },

                    include: [
                        {
                            association: "clan",
                            attributes: ["name", "leader_id", "description"]
                        },
                        {
                            association: "user",
                            attributes: ["id", "username", "isAdmin"]
                        },
                    ],
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch clan members by clan",
                {
                    details: error.message,
                    data: { clanId, options },
                });
        }
    }

    async getMembershipsByUser(userId, options = {}) {
        try {
            return await this.ClanMember.scope("public").findAll(
                {
                    where: { user_id: userId},
                    include: [{
                        association: "clan",
                        attributes: ["name", "leader_id", "description"],
                        required: false,
                    }],
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch clan memberships by user",
                {
                    details: error.message,
                    data: { userId, options },
                });
        }
    }
}

module.exports = ClanMemberRepository;
