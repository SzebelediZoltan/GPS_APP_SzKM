const { DbError } = require("../errors");

class TripRepository {
    constructor(db) {
        this.Trip = db.Trip;
        this.sequelize = db.sequelize;
    }

    async getTrips(options = {}) {
        try {
            return await this.Trip.scope("public").findAll({ transaction: options.transaction });
        }
        catch (error) {
            throw new DbError("Failed to fetch trips",
                {
                    details: error.message,
                    data: { options },
                });
        }
    }

    async getTrip(tripId, options = {}) {
        try {
            return await this.Trip.scope("public").findByPk(tripId, { transaction: options.transaction });
        }
        catch (error) {
            throw new DbError("Failed to fetch trip",
                {
                    details: error.message,
                    data: { tripId, options },
                });
        }
    }

    async createTrip(data, options = {}) {
        try {
            return await this.Trip.create(data, { transaction: options.transaction });
        }
        catch (error) {
            throw new DbError("Failed to create trip",
                {
                    details: error.message,
                    data: { data, options },
                });
        }
    }

    async updateTrip(data, tripId, options = {}) {
        try {
            await this.Trip.update({ ...data },
                {
                    where: { id: tripId },
                    transaction: options.transaction,
                });

            return await this.Trip.scope("public").findByPk(tripId, { transaction: options.transaction });
        }
        catch (error) {
            throw new DbError("Failed to update trip",
                {
                    details: error.message,
                    data: { data, tripId, options },
                });
        }
    }

    async deleteTrip(tripId, options = {}) {
        try {
            return await this.Trip.destroy(
                {
                    where: { id: tripId },
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to delete trip",
                {
                    details: error.message,
                    data: { tripId, options },
                });
        }
    }

    async getTripByUserAndName(userId, tripName, options = {}) {
        try {
            return await this.Trip.scope("public").findOne(
                {
                    where:
                    {
                        user_id: userId,
                        trip_name: tripName,
                    },
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch trip by user and number",
                {
                    details: error.message,
                    data: { userId, tripName: tripName, options },
                });
        }
    }

    async getTripsByUser(userId, options = {}) {
        try {
            return await this.Trip.scope("public").findAll(
                {
                    where: { user_id: userId },
                    transaction: options.transaction,
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch trips by user",
                {
                    details: error.message,
                    data: { userId, options },
                });
        }
    }
}

module.exports = TripRepository;
