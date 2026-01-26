const { BadRequestError, NotFoundError } = require("../errors");

class TripPointService {
    constructor(db) {
        this.tripPointRepository = require("../repositories")(db).tripPointRepository;
    }

    async getTripPoints() {
        return await this.tripPointRepository.getTripPoints();
    }

    async getTripPoint(pointId) {
        if (!pointId) throw new BadRequestError("Hiányzik a pont azonosító (pointId).");

        const point = await this.tripPointRepository.getTripPoint(pointId);

        if (!point) throw new NotFoundError("Nem található útvonalpont ezzel az azonosítóval.",
            {
                data: pointId
            });

        return point;
    }

    async createTripPoint(data) {
        if (!data) throw new BadRequestError("Hiányzik az útvonalpont adata (payload).", { data });
        if (!data.trip_id) throw new BadRequestError("Hiányzik a trip azonosító (trip_id).", { data });
        if (data.lat === undefined) throw new BadRequestError("Hiányzik a pont szélesség (lat).", { data });
        if (data.lng === undefined) throw new BadRequestError("Hiányzik a pont hosszúság (lng).", { data });
        if (!data.recorded_at) throw new BadRequestError("Hiányzik a rögzítési idő (recorded_at).", { data });

        return await this.tripPointRepository.createTripPoint(data);
    }

    async updateTripPoint(data, pointId) {
        if (!pointId) throw new BadRequestError("Hiányzik a pont azonosító (pointId).");
        if (!data) throw new BadRequestError("Hiányzik a módosításhoz szükséges adat (payload).", { data });

        const exists = await this.tripPointRepository.getTripPoint(pointId);
        if (!exists) throw new NotFoundError("Nem található útvonalpont ezzel az azonosítóval.", { data: pointId });

        return await this.tripPointRepository.updateTripPoint(data, pointId);
    }

    async deleteTripPoint(pointId) {
        if (!pointId) throw new BadRequestError("Hiányzik a pont azonosító (pointId).");

        const exists = await this.tripPointRepository.getTripPoint(pointId);
        if (!exists) throw new NotFoundError("Nem található útvonalpont ezzel az azonosítóval.", { data: pointId });

        return await this.tripPointRepository.deleteTripPoint(pointId);
    }

    async getPointsByTrip(tripId) {
        if (!tripId) throw new BadRequestError("Hiányzik a trip azonosító (tripId).");

        return await this.tripPointRepository.getPointsByTrip(tripId);
    }
}

module.exports = TripPointService;
