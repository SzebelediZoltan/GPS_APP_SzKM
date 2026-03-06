const { DbError } = require("../errors");

class TripPointRepository {
    constructor(db) {
        this.TripPoint = db.TripPoint;
        this.sequelize = db.sequelize;
    }

    async getTripPoints(options = {}) {
        try {
            return await this.TripPoint.scope("public").findAll({ transaction: options.transaction });
        }
        catch (error) {
            throw new DbError("Failed to fetch trip points",
                {
                    details: error.message,
                    data: { options },
                });
        }
    }

    async getTripPoint(pointId, options = {}) {
        try {
            return await this.TripPoint.scope("public").findByPk(pointId, { transaction: options.transaction });
        }
        catch (error) {
            throw new DbError("Failed to fetch trip point",
                {
                    details: error.message,
                    data: { pointId, options },
                });
        }
    }

    async createTripPoint(data, options = {}) {
        try {
            return await this.TripPoint.create(data, { transaction: options.transaction });
        }
        catch (error) {
            throw new DbError("Failed to create trip point",
                {
                    details: error.message,
                    data: { data, options },
                });
        }
    }

    async updateTripPoint(data, pointId, options = {}) {
        try {
            await this.TripPoint.update({ ...data },
                {
                    where: { id: pointId },
                    transaction: options.transaction,
                });

            return await this.TripPoint.scope("public").findByPk(pointId, { transaction: options.transaction });
        }
        catch (error) {
            throw new DbError("Failed to update trip point",
                {
                    details: error.message,
                    data: { data, pointId, options },
                });
        }
    }

    async deleteTripPoint(pointId, options = {}) {
        try {
            return await this.TripPoint.destroy(
                {
                    where: { id: pointId },
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to delete trip point",
                {
                    details: error.message,
                    data: { pointId, options },
                });
        }
    }

    async getPointsByTrip(tripId, options = {}) {
        try {
            return await this.TripPoint.scope("public").findAll(
                {
                    where: { trip_id: tripId },
                    order: [["recorded_at", "ASC"]],
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch trip points by trip",
                {
                    details: error.message,
                    data: { tripId, options },
                });
        }
    }
}

module.exports = TripPointRepository;
