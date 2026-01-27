const { BadRequestError, NotFoundError } = require("../errors");

class FriendWithService {
    constructor(db) {
        this.friendWithRepository = require("../repositories")(db).friendWithRepository;
    }

    async getAll() {
        return await this.friendWithRepository.getAll();
    }

    async getById(id) {
        if (!id) throw new BadRequestError("Hiányzik a barátság-azonosító (id).");

        const rel = await this.friendWithRepository.getById(id);

        console.log("FriendWithService.getById:", rel);
        

        if (!rel) throw new NotFoundError("Nem található barátság/kérelem ezzel az azonosítóval.",
            {
                data: id
            });

        return rel;
    }

    async create(data) {
        if (!data) throw new BadRequestError("Hiányzik a barátság/kérelem adata (payload).", { data });
        if (!data.sender_id) throw new BadRequestError("Hiányzik a küldő azonosító (sender_id).", { data });
        if (!data.receiver_id) throw new BadRequestError("Hiányzik a fogadó azonosító (receiver_id).", { data });

        return await this.friendWithRepository.create(data);
    }

    async update(data, id) {
        if (!id) throw new BadRequestError("Hiányzik a barátság-azonosító (id).");
        if (!data) throw new BadRequestError("Hiányzik a módosításhoz szükséges adat (payload).", { data });

        const exists = await this.friendWithRepository.getById(id);
        if (!exists) throw new NotFoundError("Nem található barátság/kérelem ezzel az azonosítóval.", { data: id });

        return await this.friendWithRepository.update(data, id);
    }

    async delete(id) {
        if (!id) throw new BadRequestError("Hiányzik a barátság-azonosító (id).");

        const exists = await this.friendWithRepository.getById(id);
        if (!exists) throw new NotFoundError("Nem található barátság/kérelem ezzel az azonosítóval.", { data: id });

        return await this.friendWithRepository.delete(id);
    }

    async getPendingForUser(userId) {
        if (!userId) throw new BadRequestError("Hiányzik a felhasználó azonosító (userId).");

        return await this.friendWithRepository.getPendingForUser(userId);
    }

    async getAcceptedForUser(userId) {
        if (!userId) throw new BadRequestError("Hiányzik a felhasználó azonosító (userId).");

        return await this.friendWithRepository.getAcceptedForUser(userId);
    }
}

module.exports = FriendWithService;
