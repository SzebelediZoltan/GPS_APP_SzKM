const { DbError } = require("../errors");
const { Op } = require("sequelize");

class MarkerRepository {
    constructor(db) {
        this.Marker = db.Marker;
        this.sequelize = db.sequelize;
    }

    async getMarkers() {
        try {
            return await this.Marker.scope("public").findAll();
        }
        catch (error) {
            throw new DbError("Failed to fetch markers",
                {
                    details: error.message,
                });
        }
    }

    async getMarker(markerId) {
        try {
            return await this.Marker.scope("public").findByPk(markerId);
        }
        catch (error) {
            throw new DbError("Failed to fetch marker",
                {
                    details: error.message,
                    data: markerId,
                });
        }
    }

    async createMarker(data) {
        try {
            return await this.Marker.create(data);
        }
        catch (error) {
            throw new DbError("Failed to create marker",
                {
                    details: error.message,
                    data,
                });
        }
    }

    async updateMarker(data, markerId) {
        try {
            await this.Marker.update({ ...data },
                {
                    where: { id: markerId }
                });
            
            if ((await this.Marker.scope("public").findByPk(markerId)).dataValues.score === -2) {
                await this.Marker.destroy(markerId)
            }

            return (await this.Marker.scope("public").findByPk(markerId)) || "Marker deleted";
        }
        catch (error) {
            throw new DbError("Failed to update marker",
                {
                    details: error.message,
                    data: { data, markerId },
                });
        }
    }

    async deleteMarker(markerId) {
        try {
            return await this.Marker.destroy(
                {
                    where: { id: markerId }
                });
        }
        catch (error) {
            throw new DbError("Failed to delete marker",
                {
                    details: error.message,
                    data: markerId,
                });
        }
    }

    async getMarkersByCreator(userId) {
        try {
            return await this.Marker.scope("public").findAll(
                {
                    where: { creator_id: userId }
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch markers by creator",
                {
                    details: error.message,
                    data: userId,
                });
        }
    }

    async getMarkersByType(markerType) {
        try {
            return await this.Marker.scope("public").findAll(
                {
                    where: { marker_type: markerType }
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch markers by type",
                {
                    details: error.message,
                    data: markerType,
                });
        }
    }

    async getMarkersInBox(minLat, maxLat, minLng, maxLng) {
        try {
            return await this.Marker.scope("public").findAll(
                {
                    where:
                    {
                        lat: { [Op.between]: [minLat, maxLat] },
                        lng: { [Op.between]: [minLng, maxLng] },
                    }
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch markers in area",
                {
                    details: error.message,
                    data: { minLat, maxLat, minLng, maxLng },
                });
        }
    }
}

module.exports = MarkerRepository;
