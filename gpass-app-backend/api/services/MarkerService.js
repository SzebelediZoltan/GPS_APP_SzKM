const { BadRequestError, NotFoundError } = require("../errors");

class MarkerService {
    constructor(db) {
        this.markerRepository = require("../repositories")(db).markerRepository;
    }

    async getMarkers(options = {}) {
        return await this.markerRepository.getMarkers(options);
    }

    async getMarker(markerId, options = {}) {
        if (!markerId) throw new BadRequestError("Hiányzik a marker azonosító (markerId).");

        const marker = await this.markerRepository.getMarker(markerId, options);

        if (!marker) throw new NotFoundError("Nem található marker ezzel az azonosítóval.",
            {
                data: markerId
            });

        return marker;
    }

    async createMarker(data, options = {}) {
        if (!data) throw new BadRequestError("Hiányzik a marker adata (payload).", { data });
        if (!data.creator_id) throw new BadRequestError("Hiányzik a létrehozó azonosító (creator_id).", { data });
        if (!data.marker_type) throw new BadRequestError("Hiányzik a marker típusa (marker_type).", { data });
        if (data.lat === undefined) throw new BadRequestError("Hiányzik a marker szélesség (lat).", { data });
        if (data.lng === undefined) throw new BadRequestError("Hiányzik a marker hosszúság (lng).", { data });

        return await this.markerRepository.createMarker(data, options);
    }

    async updateMarker(data, markerId, options = {}) {
        if (!markerId) throw new BadRequestError("Hiányzik a marker azonosító (markerId).");
        if (!data) throw new BadRequestError("Hiányzik a módosításhoz szükséges adat (payload).", { data });

        const exists = await this.markerRepository.getMarker(markerId, options);
        if (!exists) throw new NotFoundError("Nem található marker ezzel az azonosítóval.", { data: markerId });

        return await this.markerRepository.updateMarker(data, markerId, options);
    }

    async deleteMarker(markerId, options = {}) {
        if (!markerId) throw new BadRequestError("Hiányzik a marker azonosító (markerId).");

        const exists = await this.markerRepository.getMarker(markerId, options);
        if (!exists) throw new NotFoundError("Nem található marker ezzel az azonosítóval.", { data: markerId });

        return await this.markerRepository.deleteMarker(markerId, options);
    }

    async getMarkersByCreator(userId, options = {}) {
        if (!userId) throw new BadRequestError("Hiányzik a felhasználó azonosító (userId).");

        return await this.markerRepository.getMarkersByCreator(userId, options);
    }

    async getMarkersByType(markerType, options = {}) {
        if (!markerType) throw new BadRequestError("Hiányzik a marker típus (markerType).");

        return await this.markerRepository.getMarkersByType(markerType, options);
    }

    async getMarkersInBox(minLat, maxLat, minLng, maxLng, options = {}) {
        if (minLat === undefined) throw new BadRequestError("Hiányzik a minimum szélesség (minLat).");
        if (maxLat === undefined) throw new BadRequestError("Hiányzik a maximum szélesség (maxLat).");
        if (minLng === undefined) throw new BadRequestError("Hiányzik a minimum hosszúság (minLng).");
        if (maxLng === undefined) throw new BadRequestError("Hiányzik a maximum hosszúság (maxLng).");

        return await this.markerRepository.getMarkersInBox(minLat, maxLat, minLng, maxLng, options);
    }
}

module.exports = MarkerService;
