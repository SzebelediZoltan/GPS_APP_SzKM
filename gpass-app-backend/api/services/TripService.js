const { BadRequestError, NotFoundError } = require("../errors");

class TripService {
    constructor(db) {
        this.tripRepository = require("../repositories")(db).tripRepository;
    }

    async getTrips() {
        return await this.tripRepository.getTrips();
    }

    async getTrip(tripId) {
        if (!tripId) throw new BadRequestError("Hiányzik a trip azonosító (tripId).");

        const trip = await this.tripRepository.getTrip(tripId);

        if (!trip) throw new NotFoundError("Nem található trip ezzel az azonosítóval.",
            {
                data: tripId
            });

        return trip;
    }

    async createTrip(data) {
        if (!data) throw new BadRequestError("Hiányzik a trip adata (payload).", { data });
        if (!data.user_id) throw new BadRequestError("Hiányzik a felhasználó azonosító (user_id).", { data });
        if (!data.trip_name) throw new BadRequestError("Hiányzik a trip név (trip_name).", { data });

        return await this.tripRepository.createTrip(data);
    }

    async updateTrip(data, tripId) {
        if (!tripId) throw new BadRequestError("Hiányzik a trip azonosító (tripId).");
        if (!data) throw new BadRequestError("Hiányzik a módosításhoz szükséges adat (payload).", { data });

        const exists = await this.tripRepository.getTrip(tripId);
        if (!exists) throw new NotFoundError("Nem található trip ezzel az azonosítóval.", { data: tripId });

        return await this.tripRepository.updateTrip(data, tripId);
    }

    async deleteTrip(tripId) {
        if (!tripId) throw new BadRequestError("Hiányzik a trip azonosító (tripId).");

        const exists = await this.tripRepository.getTrip(tripId);
        if (!exists) throw new NotFoundError("Nem található trip ezzel az azonosítóval.", { data: tripId });

        return await this.tripRepository.deleteTrip(tripId);
    }

    async getTripByUserAndNumber(userId, tripName) {
        if (!userId) throw new BadRequestError("Hiányzik a felhasználó azonosító (userId).");
        if (!tripName) throw new BadRequestError("Hiányzik a trip sorszám (tripName).");

        const trip = await this.tripRepository.getTripByUserAndNumber(userId, tripName);

        if (!trip) throw new NotFoundError("Nem található trip ezzel a felhasználóval és tripszámmal.",
            {
                data: { userId, tripName }
            });

        return trip;
    }

    async getTripsByUser(userId) {
        if (!userId) throw new BadRequestError("Hiányzik a felhasználó azonosító (userId).");

        return await this.tripRepository.getTripsByUser(userId);
    }
}

module.exports = TripService;
