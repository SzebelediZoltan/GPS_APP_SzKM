const { BadRequestError, NotFoundError } = require("../errors");

class ClanService {
    constructor(db) {
        this.clanRepository = require("../repositories")(db).clanRepository;
        this.userRepository = require("../repositories")(db).userRepository;
    }

    async getClans(options = {}) {
        return await this.clanRepository.getClans(options);
    }

    async getClan(clanId, options = {}) {
        if (!clanId) throw new BadRequestError("Hiányzik a klán azonosító (clanId).");

        const clan = await this.clanRepository.getClan(clanId, options);

        if (!clan) throw new NotFoundError("Nem található klán ezzel az azonosítóval.",
            {
                data: clanId
            });

        return clan;
    }

    async createClan(data, options = {}) {
        if (!data) throw new BadRequestError("Hiányzik a klán adata (payload).", { data });
        if (!data.name) throw new BadRequestError("Hiányzik a klán neve (name).", { data });
        if (!data.leader_id) throw new BadRequestError("Hiányzik a klánvezető azonosító (leader_id).", { data });

        const nameTaken = await this.clanRepository.getClan(data.name, options);

        if (nameTaken) throw new BadRequestError("Ez a klán név már foglalt.", { data: data.name });

        const UserExists = await this.userRepository.getUser(data.leader_id, options)

        if (!UserExists) throw new BadRequestError("Nincs ilyen felhasználó a megadott ID-val.", { data: data.leader_id })

        return await this.clanRepository.createClan(data, options);
    }

    async updateClan(data, clanId, options = {}) {
        if (!clanId) throw new BadRequestError("Hiányzik a klán azonosító (clanId).");
        if (!data) throw new BadRequestError("Hiányzik a módosításhoz szükséges adat (payload).", { data });

        const exists = await this.clanRepository.getClan(clanId, options);
        if (!exists) throw new NotFoundError("Nem található klán ezzel az azonosítóval.", { data: clanId });

        if (data.name && data.name !== exists.name) {
            const nameTaken = await this.clanRepository.getClan(data.name, options);
            if (nameTaken) throw new BadRequestError("Ez a klán név már foglalt.", { data: data.name });
        }

        return await this.clanRepository.updateClan(data, clanId, options);
    }

    async deleteClan(clanId, options = {}) {
        if (!clanId) throw new BadRequestError("Hiányzik a klán azonosító (clanId).");

        const exists = await this.clanRepository.getClan(clanId, options);
        if (!exists) throw new NotFoundError("Nem található klán ezzel az azonosítóval.", { data: clanId });

        return await this.clanRepository.deleteClan(clanId, options);
    }

    async changeLeader(leaderId, clanId, options = {}) {
        if (!clanId) throw new BadRequestError("Hiányzik a klán azonosító (clanId).");
        if (!leaderId) throw new BadRequestError("Hiányzik az új vezető azonosítója (leader_id).");

        const exists = await this.clanRepository.getClan(clanId, options);
        if (!exists) throw new NotFoundError("Nem található klán ezzel az azonosítóval.", { data: clanId });

        const userExists = await this.userRepository.getUser(leaderId, options);
        if (!userExists) throw new BadRequestError("Nincs ilyen felhasználó a megadott ID-val.", { data: leaderId });

        return await this.clanRepository.updateClan({ leader_id: leaderId }, clanId, options);
    }

    async searchClans(query, options = {}) {
        if (!query) throw new BadRequestError("Hiányzik a keresési kifejezés (query).");

        return await this.clanRepository.searchClans(query, options);
    }
}

module.exports = ClanService;
