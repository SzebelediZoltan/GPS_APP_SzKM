const { BadRequestError, NotFoundError } = require("../errors");

class TripService {
    constructor(db) {
        this.tripRepository = require("../repositories")(db).tripRepository;
    }

    async getTrips(options = {}) {
        return await this.tripRepository.getTrips(options);
    }

    async getTrip(tripId, options = {}) {
        if (!tripId) throw new BadRequestError("Hiányzik a trip azonosító (tripId).");

        const trip = await this.tripRepository.getTrip(tripId, options);

        if (!trip) throw new NotFoundError("Nem található trip ezzel az azonosítóval.",
            {
                data: tripId
            });

        return trip;
    }

    async createTrip(data, options = {}) {
        if (!data) throw new BadRequestError("Hiányzik a trip adata (payload).", { data });
        if (!data.user_id) throw new BadRequestError("Hiányzik a felhasználó azonosító (user_id).", { data });
        if (!data.trip_name) throw new BadRequestError("Hiányzik a trip név (trip_name).", { data });

        return await this.tripRepository.createTrip(data, options);
    }

    async updateTrip(data, tripId, options = {}) {
        if (!tripId) throw new BadRequestError("Hiányzik a trip azonosító (tripId).");
        if (!data) throw new BadRequestError("Hiányzik a módosításhoz szükséges adat (payload).", { data });

        const exists = await this.tripRepository.getTrip(tripId, options);
        if (!exists) throw new NotFoundError("Nem található trip ezzel az azonosítóval.", { data: tripId });

        return await this.tripRepository.updateTrip(data, tripId, options);
    }

    async deleteTrip(tripId, options = {}) {
        if (!tripId) throw new BadRequestError("Hiányzik a trip azonosító (tripId).");

        const exists = await this.tripRepository.getTrip(tripId, options);
        if (!exists) throw new NotFoundError("Nem található trip ezzel az azonosítóval.", { data: tripId });

        return await this.tripRepository.deleteTrip(tripId, options);
    }

    async getTripByUserAndNumber(userId, tripName, options = {}) {
        if (!userId) throw new BadRequestError("Hiányzik a felhasználó azonosító (userId).");
        if (!tripName) throw new BadRequestError("Hiányzik a trip sorszám (tripName).");

        const trip = await this.tripRepository.getTripByUserAndNumber(userId, tripName, options);

        if (!trip) throw new NotFoundError("Nem található trip ezzel a felhasználóval és tripszámmal.",
            {
                data: { userId, tripName }
            });

        return trip;
    }

    async getTripsByUser(userId, options = {}) {
        if (!userId) throw new BadRequestError("Hiányzik a felhasználó azonosító (userId).");

        return await this.tripRepository.getTripsByUser(userId, options);
    }
}

module.exports = TripService;
