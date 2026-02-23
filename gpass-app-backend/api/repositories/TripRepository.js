const { DbError } = require("../errors");

class TripRepository {
    constructor(db) {
        this.Trip = db.Trip;
        this.sequelize = db.sequelize;
    }

    async getTrips() {
        try {
            return await this.Trip.scope("public").findAll();
        }
        catch (error) {
            throw new DbError("Failed to fetch trips",
                {
                    details: error.message,
                });
        }
    }

    async getTrip(tripId) {
        try {
            return await this.Trip.scope("public").findByPk(tripId);
        }
        catch (error) {
            throw new DbError("Failed to fetch trip",
                {
                    details: error.message,
                    data: tripId,
                });
        }
    }

    async createTrip(data) {
        try {
            return await this.Trip.create(data);
        }
        catch (error) {
            throw new DbError("Failed to create trip",
                {
                    details: error.message,
                    data,
                });
        }
    }

    async updateTrip(data, tripId) {
        try {
            await this.Trip.update({ ...data },
                {
                    where: { id: tripId }
                });

            return await this.Trip.scope("public").findByPk(tripId);
        }
        catch (error) {
            throw new DbError("Failed to update trip",
                {
                    details: error.message,
                    data: { data, tripId },
                });
        }
    }

    async deleteTrip(tripId) {
        try {
            return await this.Trip.destroy(
                {
                    where: { id: tripId }
                });
        }
        catch (error) {
            throw new DbError("Failed to delete trip",
                {
                    details: error.message,
                    data: tripId,
                });
        }
    }

    async getTripByUserAndName(userId, tripName) {
        try {
            return await this.Trip.scope("public").findOne(
                {
                    where:
                    {
                        user_id: userId,
                        trip_name: tripName,
                    }
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch trip by user and number",
                {
                    details: error.message,
                    data: { userId, tripName: tripName },
                });
        }
    }

    async getTripsByUser(userId) {
        try {
            return await this.Trip.scope("public").findAll(
                {
                    where: { user_id: userId }
                });
        }
        catch (error) {
            throw new DbError("Failed to fetch trips by user",
                {
                    details: error.message,
                    data: userId,
                });
        }
    }
}

module.exports = TripRepository;
