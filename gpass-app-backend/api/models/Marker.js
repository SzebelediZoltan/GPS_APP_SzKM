const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Marker extends Model { };

    Marker.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            creator_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: "A creator_id megadása kötelező." },
                    isInt: { msg: "A creator_id csak egész szám lehet." },
                    min: { args: [1], msg: "A creator_id csak pozitív szám lehet." },
                },
            },

            marker_type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "A marker típusa (marker_type) megadása kötelező." },
                    notEmpty: { msg: "A marker típusa (marker_type) nem lehet üres." },
                    isIn: {
                        // Bővítsd nyugodtan, ez csak egy normál alap
                        args: [[
                            "danger",
                            "police",
                            "accident",
                            "traffic",
                            "roadblock",
                            "speedtrap",
                            "other",
                        ]],
                        msg: "Érvénytelen marker típus (marker_type).",
                    },
                },
            },

            score: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
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
            modelName: "Marker",
            tableName: "markers",
            timestamps: false,

            indexes: [
                { fields: ["creator_id"], name: "ix_markers_creator_id" },
                { fields: ["marker_type"], name: "ix_markers_marker_type" },
                { fields: ["created_at"], name: "ix_markers_created_at" },
                // ha később kell “közeli markerek”, akkor sok DB-ben érdemes geospatial megoldás,
                // de addig legalább külön indexelheted:
                { fields: ["lat", "lng"], name: "ix_markers_lat_lng" },
            ],

            scopes: {
                public: {
                    attributes: ["id", "creator_id", "marker_type", "score", "lat", "lng", "created_at"],
                },
                minimal: {
                    attributes: ["id", "marker_type", "score", "lat", "lng"],
                },
                forMap: {
                    // tipikus “térképre rajzolás” scope
                    attributes: ["id", "marker_type", "score", "lat", "lng"],
                },
                admin: {
                    attributes: ["id", "creator_id", "marker_type", "score", "lat", "lng", "created_at"],
                },
            },

            defaultScope: {
                attributes: ["id", "creator_id", "marker_type", "score", "lat", "lng", "created_at"],
            },
        }
    );


    return Marker;
}