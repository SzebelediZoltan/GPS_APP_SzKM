const { BadRequestError, NotFoundError } = require("../errors");

class ClanMemberService
{
    constructor(db)
    {
        this.clanMemberRepository = require("../repositories")(db).clanMemberRepository;
        this.clanRepository = require("../repositories")(db).clanRepository;
        this.userRepository = require("../repositories")(db).userRepository;
    }

    async getMembers(options = {})
    {
        return await this.clanMemberRepository.getMembers(options);
    }

    async getMember(clanId, userId, options = {})
    {
        if(!clanId) throw new BadRequestError("Hiányzik a klán azonosító (clanId).");
        if(!userId) throw new BadRequestError("Hiányzik a felhasználó azonosító (userId).");

        const member = await this.clanMemberRepository.getMember(clanId, userId, options);

        if(!member) throw new NotFoundError("Nem található ilyen klántagság.",
        {
            data: { clanId, userId }
        });

        return member;
    }

    async addMember(data, options = {})
    {
        if(!data) throw new BadRequestError("Hiányzik a klántagság adata (payload).", { data });
        if(!data.clan_id) throw new BadRequestError("Hiányzik a klán azonosító (clan_id).", { data });
        if(!data.user_id) throw new BadRequestError("Hiányzik a felhasználó azonosító (user_id).", { data });

        
        const clans = await this.clanRepository.getClans(options);
        const clanExists = clans.some(clan => clan.id === data.clan_id);
        if (!clanExists) throw new BadRequestError("Nincs ilyen klán.", { data });

        const user = await this.userRepository.getUser(data.user_id, options)

        if(!user) throw new BadRequestError("Nincs ilyen felhasználó.", { data })

        const clan = await this.clanRepository.getClan(data.clan_id, options)
        const leaderId = clan.leader_id

        if(leaderId === data.user_id) throw new BadRequestError("Leaderként nem lehetsz tag is.", {data})


        return await this.clanMemberRepository.addMember(data, options);
    }

    async removeMember(clanId, userId, options = {})
    {
        if(!clanId) throw new BadRequestError("Hiányzik a klán azonosító (clanId).");
        if(!userId) throw new BadRequestError("Hiányzik a felhasználó azonosító (userId).");

        const exists = await this.clanMemberRepository.getMember(clanId, userId, options);
        if(!exists) throw new NotFoundError("Nem található ilyen klántagság.", { data: { clanId, userId } });

        return await this.clanMemberRepository.removeMember(clanId, userId, options);
    }

    async getMembersByClan(clanId, options = {})
    {
        if(!clanId) throw new BadRequestError("Hiányzik a klán azonosító (clanId).");

        return await this.clanMemberRepository.getMembersByClan(clanId, options);
    }

    async getMembershipsByUser(userId, options = {})
    {
        if(!userId) throw new BadRequestError("Hiányzik a felhasználó azonosító (userId).");

        return await this.clanMemberRepository.getMembershipsByUser(userId, options);
    }
}

module.exports = ClanMemberService;
