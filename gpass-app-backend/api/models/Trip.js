const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Trip extends Model { };

    Trip.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: "A user_id megadása kötelező." },
                    isInt: { msg: "A user_id csak egész szám lehet." },
                    min: { args: [1], msg: "A user_id csak pozitív szám lehet." },
                },
            },

            trip_number: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: "A trip_number megadása kötelező." },
                    isInt: { msg: "A trip_number csak egész szám lehet." },
                    min: { args: [1], msg: "A trip_number csak pozitív szám lehet." },
                },
            },

            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                validate: {
                    isDate: { msg: "A created_at érvénytelen dátum." },
                },
            },
        },
        {
            sequelize,
            modelName: "Trip",
            tableName: "trips",
            timestamps: false,

            indexes: [
                {
                    unique: true,
                    fields: ["user_id", "trip_number"],
                    name: "uq_trips_user_trip_number",
                },
                { fields: ["user_id"], name: "ix_trips_user_id" },
                { fields: ["created_at"], name: "ix_trips_created_at" },
            ],

            scopes: {
                public: {
                    attributes: ["id", "user_id", "trip_number", "created_at"],
                },
                minimal: {
                    attributes: ["id", "trip_number"],
                },
                admin: {
                    attributes: ["id", "user_id", "trip_number", "created_at"],
                },
            },

            defaultScope: {
                attributes: ["id", "user_id", "trip_number", "created_at"],
            },
        }
    );


    return Trip;
}