const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) =>
{
    class Marker extends Model {};

    Marker.init
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

            type: {
                type: DataTypes.ENUM("Kátyú, Úthiba", "Forgalom", "Baleset", "Rendőr, Sebességmérés", "Egyéb"),
                allowNull: false
            },

            creator: {
                type: DataTypes.STRING,
                allowNull:false
            },
            score: {
                type: DataTypes.INTEGER,
                allowNull:false,
                defaultValue: 0
            }

        },

        {
            sequelize,
            modelName: "Marker",
            createdAt: "capturedAt",
            updatedAt: false,
        },
    );

    return Marker;
}