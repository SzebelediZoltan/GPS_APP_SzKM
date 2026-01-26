const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class TripPoint extends Model { };

    TripPoint.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            trip_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: "A trip_id megadása kötelező." },
                    isInt: { msg: "A trip_id csak egész szám lehet." },
                    min: { args: [1], msg: "A trip_id csak pozitív szám lehet." },
                },
            },

            lat: {
                type: DataTypes.DECIMAL(9, 6),
                allowNull: false,
                validate: {
                    notNull: { msg: "A lat megadása kötelező." },
                    isDecimal: { msg: "A lat csak szám lehet." },
                    min: { args: [-90], msg: "A lat minimum -90 lehet." },
                    max: { args: [90], msg: "A lat maximum 90 lehet." },
                },
            },

            lng: {
                type: DataTypes.DECIMAL(9, 6),
                allowNull: false,
                validate: {
                    notNull: { msg: "A lng megadása kötelező." },
                    isDecimal: { msg: "A lng csak szám lehet." },
                    min: { args: [-180], msg: "A lng minimum -180 lehet." },
                    max: { args: [180], msg: "A lng maximum 180 lehet." },
                },
            },

            recorded_at: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    notNull: { msg: "A recorded_at megadása kötelező." },
                    isDate: { msg: "A recorded_at érvénytelen dátum." },
                },
            },
        },
        {
            sequelize,
            modelName: "TripPoint",
            tableName: "trip_points",
            timestamps: false,

            indexes: [
                {
                    fields: ["trip_id", "recorded_at"],
                    name: "ix_trip_points_trip_time",
                },
                {
                    fields: ["trip_id"],
                    name: "ix_trip_points_trip_id",
                },
            ],

            scopes: {
                public: {
                    attributes: ["id", "trip_id", "lat", "lng", "recorded_at"],
                },

                minimal: {
                    attributes: ["lat", "lng", "recorded_at"],
                },

                admin: {
                    attributes: ["id", "trip_id", "lat", "lng", "recorded_at"],
                },
            },

            defaultScope: {
                attributes: ["id", "trip_id", "lat", "lng", "recorded_at"],
            },
        }
    );


    return TripPoint;
}