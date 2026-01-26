const { BadRequestError, NotFoundError } = require("../errors");

class ClanService {
    constructor(db) {
        this.clanRepository = require("../repositories")(db).clanRepository;
    }

    async getClans() {
        return await this.clanRepository.getClans();
    }

    async getClan(clanId) {
        if (!clanId) throw new BadRequestError("Hiányzik a klán azonosító (clanId).");

        const clan = await this.clanRepository.getClan(clanId);

        if (!clan) throw new NotFoundError("Nem található klán ezzel az azonosítóval.",
            {
                data: clanId
            });

        return clan;
    }

    async createClan(data) {
        if (!data) throw new BadRequestError("Hiányzik a klán adata (payload).", { data });
        if (!data.name) throw new BadRequestError("Hiányzik a klán neve (name).", { data });
        if (!data.leader_id) throw new BadRequestError("Hiányzik a klánvezető azonosító (leader_id).", { data });

        return await this.clanRepository.createClan(data);
    }

    async updateClan(data, clanId) {
        if (!clanId) throw new BadRequestError("Hiányzik a klán azonosító (clanId).");
        if (!data) throw new BadRequestError("Hiányzik a módosításhoz szükséges adat (payload).", { data });

        const exists = await this.clanRepository.getClan(clanId);
        if (!exists) throw new NotFoundError("Nem található klán ezzel az azonosítóval.", { data: clanId });

        return await this.clanRepository.updateClan(data, clanId);
    }

    async deleteClan(clanId) {
        if (!clanId) throw new BadRequestError("Hiányzik a klán azonosító (clanId).");

        const exists = await this.clanRepository.getClan(clanId);
        if (!exists) throw new NotFoundError("Nem található klán ezzel az azonosítóval.", { data: clanId });

        return await this.clanRepository.deleteClan(clanId);
    }

    async searchClans(query) {
        if (!query) throw new BadRequestError("Hiányzik a keresési kifejezés (query).");

        return await this.clanRepository.searchClans(query);
    }
}

module.exports = ClanService;
