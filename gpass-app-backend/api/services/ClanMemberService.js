const { BadRequestError, NotFoundError } = require("../errors");

class ClanMemberService
{
    constructor(db)
    {
        this.clanMemberRepository = require("../repositories")(db).clanMemberRepository;
        this.clanRepository = require("../repositories")(db).clanRepository;
    }

    async getMembers()
    {
        return await this.clanMemberRepository.getMembers();
    }

    async getMember(clanId, userId)
    {
        if(!clanId) throw new BadRequestError("Hiányzik a klán azonosító (clanId).");
        if(!userId) throw new BadRequestError("Hiányzik a felhasználó azonosító (userId).");

        const member = await this.clanMemberRepository.getMember(clanId, userId);

        if(!member) throw new NotFoundError("Nem található ilyen klántagság.",
        {
            data: { clanId, userId }
        });

        return member;
    }

    async addMember(data)
    {
        if(!data) throw new BadRequestError("Hiányzik a klántagság adata (payload).", { data });
        if(!data.clan_id) throw new BadRequestError("Hiányzik a klán azonosító (clan_id).", { data });
        if(!data.user_id) throw new BadRequestError("Hiányzik a felhasználó azonosító (user_id).", { data });
        // if(this.clanRepository.getClans) throw new BadRequestError("Nincs ilyen klán.", { data })

        return await this.clanMemberRepository.addMember(data);
    }

    async removeMember(clanId, userId)
    {
        if(!clanId) throw new BadRequestError("Hiányzik a klán azonosító (clanId).");
        if(!userId) throw new BadRequestError("Hiányzik a felhasználó azonosító (userId).");

        const exists = await this.clanMemberRepository.getMember(clanId, userId);
        if(!exists) throw new NotFoundError("Nem található ilyen klántagság.", { data: { clanId, userId } });

        return await this.clanMemberRepository.removeMember(clanId, userId);
    }

    async getMembersByClan(clanId)
    {
        if(!clanId) throw new BadRequestError("Hiányzik a klán azonosító (clanId).");

        return await this.clanMemberRepository.getMembersByClan(clanId);
    }

    async getMembershipsByUser(userId)
    {
        if(!userId) throw new BadRequestError("Hiányzik a felhasználó azonosító (userId).");

        return await this.clanMemberRepository.getMembershipsByUser(userId);
    }
}

module.exports = ClanMemberService;
