const { BadRequestError, NotFoundError } = require("../errors");

class FriendWithService {
    constructor(db) {
        this.friendWithRepository = require("../repositories")(db).friendWithRepository;
    }

    async getAll(options = {}) {
        return await this.friendWithRepository.getAll(options);
    }

    async getById(id, options = {}) {
        if (!id) throw new BadRequestError("Hiányzik a barátság-azonosító (id).");

        const rel = await this.friendWithRepository.getById(id, options);        

        if (!rel) throw new NotFoundError("Nem található barátság/kérelem ezzel az azonosítóval.",
            {
                data: id
            });

        return rel;
    }

    async create(data, options = {}) {
        if (!data) throw new BadRequestError("Hiányzik a barátság/kérelem adata (payload).", { data });
        if (!data.sender_id) throw new BadRequestError("Hiányzik a küldő azonosító (sender_id).", { data });
        if (!data.receiver_id) throw new BadRequestError("Hiányzik a fogadó azonosító (receiver_id).", { data });

        return await this.friendWithRepository.create(data, options);
    }

    async update(data, id, options = {}) {
        if (!id) throw new BadRequestError("Hiányzik a barátság-azonosító (id).");
        if (!data) throw new BadRequestError("Hiányzik a módosításhoz szükséges adat (payload).", { data });

        const exists = await this.friendWithRepository.getById(id, options);
        if (!exists) throw new NotFoundError("Nem található barátság/kérelem ezzel az azonosítóval.", { data: id });

        return await this.friendWithRepository.update(data, id, options);
    }

    async delete(id, options = {}) {
        if (!id) throw new BadRequestError("Hiányzik a barátság-azonosító (id).");

        const exists = await this.friendWithRepository.getById(id, options);
        if (!exists) throw new NotFoundError("Nem található barátság/kérelem ezzel az azonosítóval.", { data: id });

        return await this.friendWithRepository.delete(id, options);
    }

    async getPendingForUser(userId, options = {}) {
        if (!userId) throw new BadRequestError("Hiányzik a felhasználó azonosító (userId).");

        return await this.friendWithRepository.getPendingForUser(userId, options);
    }

    async getAcceptedForUser(userId, options = {}) {
        if (!userId) throw new BadRequestError("Hiányzik a felhasználó azonosító (userId).");

        return await this.friendWithRepository.getAcceptedForUser(userId, options);
    }
}

module.exports = FriendWithService;
