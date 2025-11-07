const { Model, DataTypes } = require("sequelize");

const authUtils = require("../utilities/authUtils");

module.exports = (sequelize) =>
{
    class Location extends Model {};

    Location.init
    (
        {
            longitude: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },

            latitude: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },

            trip: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            actualSpeed: {
                type: DataTypes.INTEGER,
                allowNull:true
            }

        },

        {
            sequelize,
            modelName: "Location",
            createdAt: "capturedAt",
            updatedAt: false,
        },
    );

    return Location;
}