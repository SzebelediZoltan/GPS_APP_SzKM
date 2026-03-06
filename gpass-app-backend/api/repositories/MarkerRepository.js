const { DbError } = require("../errors");
const { Op } = require("sequelize");

class MarkerRepository {
    constructor(db) {
        this.Marker = db.Marker;
        this.sequelize = db.sequelize;
    }

    async getMarkers(options = {}) {
        try {
            return await this.Marker.scope("public").findAll({
                transaction: options.transaction,
            });
        }
        catch (error) {
            throw new DbError("Failed to fetch markers",
                {
                    details: error.message,
                    data: { options },
                });
        }
    }

    async getMarker(markerId, options = {}) {
        try {
            return await this.Marker.scope("public").findByPk(markerId, {
                transaction: options.transaction,
            });
        }
        catch (error) {
            throw new DbError("Failed to fetch marker",
                {
                    details: error.message,
                    data: { markerId, options },
                });
        }
    }

    async createMarker(data, options = {}) {
        try {
            return await this.Marker.create(data, {
                transaction: options.transaction,
            });
        }
        catch (error) {
            throw new DbError("Failed to create marker",
                {
                    details: error.message,
                    data: { data, options },
                });
        }
    }

    async updateMarker(data, markerId, options = {}) {
        try {
            await this.Marker.update({ ...data },
                {
                    where: { id: markerId },
                    transaction: options.transaction,
                });
            
            if ((await this.Marker.scope("public").findByPk(markerId, { transaction: options.transaction })).dataValues.score === -2) {
                await this.Marker.destroy(markerId, { transaction: options.transaction })
            }

            return (await this.Marker.scope("public").findByPk(markerId, { transaction: options.transaction })) || "Marker deleted";
        }
        catch (error) {
            throw new DbError("Failed to update marker",
                {
                    details: error.message,
                    data: { data, markerId, options },
                });
        }
    }

    async deleteMarker(markerId, options = {}) {
        try {
            return await this.Marker.destroy(
                {
                    where: { id: markerId },
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to delete marker",
                {
                    details: error.message,
                    data: { markerId, options },
                });
        }
    }

    async getMarkersByCreator(userId, options = {}) {
        try {
            return await this.Marker.scope("public").findAll(
                {
                    where: { creator_id: userId },
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch markers by creator",
                {
                    details: error.message,
                    data: { userId, options },
                });
        }
    }

    async getMarkersByType(markerType, options = {}) {
        try {
            return await this.Marker.scope("public").findAll(
                {
                    where: { marker_type: markerType },
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch markers by type",
                {
                    details: error.message,
                    data: { markerType, options },
                });
        }
    }

    async getMarkersInBox(minLat, maxLat, minLng, maxLng, options = {}) {
        try {
            return await this.Marker.scope("public").findAll(
                {
                    where:
                    {
                        lat: { [Op.between]: [minLat, maxLat] },
                        lng: { [Op.between]: [minLng, maxLng] },
                    },
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch markers in area",
                {
                    details: error.message,
                    data: { minLat, maxLat, minLng, maxLng, options },
                });
        }
    }
}

module.exports = MarkerRepository;
