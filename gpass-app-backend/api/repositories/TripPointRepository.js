const { DbError } = require("../errors");

class TripPointRepository {
    constructor(db) {
        this.TripPoint = db.TripPoint;
        this.sequelize = db.sequelize;
    }

    async getTripPoints() {
        try {
            return await this.TripPoint.scope("public").findAll();
        }
        catch (error) {
            throw new DbError("Failed to fetch trip points",
                {
                    details: error.message,
                });
        }
    }

    async getTripPoint(pointId) {
        try {
            return await this.TripPoint.scope("public").findByPk(pointId);
        }
        catch (error) {
            throw new DbError("Failed to fetch trip point",
                {
                    details: error.message,
                    data: pointId,
                });
        }
    }

    async createTripPoint(data) {
        try {
            return await this.TripPoint.create(data);
        }
        catch (error) {
            throw new DbError("Failed to create trip point",
                {
                    details: error.message,
                    data,
                });
        }
    }

    async updateTripPoint(data, pointId) {
        try {
            await this.TripPoint.update({ ...data },
                {
                    where: { id: pointId }
                });

            return await this.TripPoint.scope("public").findByPk(pointId);
        }
        catch (error) {
            throw new DbError("Failed to update trip point",
                {
                    details: error.message,
                    data: { data, pointId },
                });
        }
    }

    async deleteTripPoint(pointId) {
        try {
            return await this.TripPoint.destroy(
                {
                    where: { id: pointId }
                });
        }
        catch (error) {
            throw new DbError("Failed to delete trip point",
                {
                    details: error.message,
                    data: pointId,
                });
        }
    }

    async getPointsByTrip(tripId) {
        try {
            return await this.TripPoint.scope("public").findAll(
                {
                    where: { trip_id: tripId },
                    order: [["recorded_at", "ASC"]],
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch trip points by trip",
                {
                    details: error.message,
                    data: tripId,
                });
        }
    }
}

module.exports = TripPointRepository;
