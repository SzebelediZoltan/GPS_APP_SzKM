const { DbError } = require("../errors");

class ClanMemberRepository {
    constructor(db) {
        this.ClanMember = db.ClanMember;
        this.sequelize = db.sequelize;
    }

    async getMembers() {
        try {
            return await this.ClanMember.scope("public").findAll();
        }
        catch (error) {
            throw new DbError("Failed to fetch clan members",
                {
                    details: error.message,
                });
        }
    }

    async getMember(clanId, userId) {
        try {
            return await this.ClanMember.scope("public").findOne(
                {
                    where:
                    {
                        clan_id: clanId,
                        user_id: userId,
                    }
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch clan member",
                {
                    details: error.message,
                    data: { clanId, userId },
                });
        }
    }

    async addMember(data) {
        try {
            return await this.ClanMember.create(data);
        }
        catch (error) {
            throw new DbError("Failed to add clan member",
                {
                    details: error.message,
                    data,
                });
        }
    }

    async removeMember(clanId, userId) {
        try {
            return await this.ClanMember.destroy(
                {
                    where:
                    {
                        clan_id: clanId,
                        user_id: userId,
                    }
                });
        }
        catch (error) {
            throw new DbError("Failed to remove clan member",
                {
                    details: error.message,
                    data: { clanId, userId },
                });
        }
    }

    async getMembersByClan(clanId) {
        try {
            return await this.ClanMember.scope("public").findAll(
                {
                    where: { clan_id: clanId }
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch clan members by clan",
                {
                    details: error.message,
                    data: clanId,
                });
        }
    }

    async getMembershipsByUser(userId) {
        try {
            return await this.ClanMember.scope("public").findAll(
                {
                    where: { user_id: userId }
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch clan memberships by user",
                {
                    details: error.message,
                    data: userId,
                });
        }
    }
}

module.exports = ClanMemberRepository;
