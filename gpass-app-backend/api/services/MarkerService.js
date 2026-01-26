const { BadRequestError, NotFoundError } = require("../errors");

class MarkerService {
    constructor(db) {
        this.markerRepository = require("../repositories")(db).markerRepository;
    }

    async getMarkers() {
        return await this.markerRepository.getMarkers();
    }

    async getMarker(markerId) {
        if (!markerId) throw new BadRequestError("Hiányzik a marker azonosító (markerId).");

        const marker = await this.markerRepository.getMarker(markerId);

        if (!marker) throw new NotFoundError("Nem található marker ezzel az azonosítóval.",
            {
                data: markerId
            });

        return marker;
    }

    async createMarker(data) {
        if (!data) throw new BadRequestError("Hiányzik a marker adata (payload).", { data });
        if (!data.creator_id) throw new BadRequestError("Hiányzik a létrehozó azonosító (creator_id).", { data });
        if (!data.marker_type) throw new BadRequestError("Hiányzik a marker típusa (marker_type).", { data });
        if (data.lat === undefined) throw new BadRequestError("Hiányzik a marker szélesség (lat).", { data });
        if (data.lng === undefined) throw new BadRequestError("Hiányzik a marker hosszúság (lng).", { data });

        return await this.markerRepository.createMarker(data);
    }

    async updateMarker(data, markerId) {
        if (!markerId) throw new BadRequestError("Hiányzik a marker azonosító (markerId).");
        if (!data) throw new BadRequestError("Hiányzik a módosításhoz szükséges adat (payload).", { data });

        const exists = await this.markerRepository.getMarker(markerId);
        if (!exists) throw new NotFoundError("Nem található marker ezzel az azonosítóval.", { data: markerId });

        return await this.markerRepository.updateMarker(data, markerId);
    }

    async deleteMarker(markerId) {
        if (!markerId) throw new BadRequestError("Hiányzik a marker azonosító (markerId).");

        const exists = await this.markerRepository.getMarker(markerId);
        if (!exists) throw new NotFoundError("Nem található marker ezzel az azonosítóval.", { data: markerId });

        return await this.markerRepository.deleteMarker(markerId);
    }

    async getMarkersByCreator(userId) {
        if (!userId) throw new BadRequestError("Hiányzik a felhasználó azonosító (userId).");

        return await this.markerRepository.getMarkersByCreator(userId);
    }

    async getMarkersByType(markerType) {
        if (!markerType) throw new BadRequestError("Hiányzik a marker típus (markerType).");

        return await this.markerRepository.getMarkersByType(markerType);
    }

    async getMarkersInBox(minLat, maxLat, minLng, maxLng) {
        if (minLat === undefined) throw new BadRequestError("Hiányzik a minimum szélesség (minLat).");
        if (maxLat === undefined) throw new BadRequestError("Hiányzik a maximum szélesség (maxLat).");
        if (minLng === undefined) throw new BadRequestError("Hiányzik a minimum hosszúság (minLng).");
        if (maxLng === undefined) throw new BadRequestError("Hiányzik a maximum hosszúság (maxLng).");

        return await this.markerRepository.getMarkersInBox(minLat, maxLat, minLng, maxLng);
    }
}

module.exports = MarkerService;
