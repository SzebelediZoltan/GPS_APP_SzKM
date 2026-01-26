const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Clan extends Model { };

    Clan.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notNull: { msg: "A klán név megadása kötelező." },
                    notEmpty: { msg: "A klán név nem lehet üres." },
                    len: {
                        args: [3, 40],
                        msg: "A klán név hossza 3 és 40 karakter között kell legyen.",
                    },
                    is: {
                        // betű (ékezet is), szám, szóköz, _ és -
                        args: /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9 _-]{3,40}$/,
                        msg: "A klán név csak betűt, számot, szóközt, '_' vagy '-' karaktert tartalmazhat.",
                    },
                },
            },

            leader_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: "A leader_id megadása kötelező." },
                    isInt: { msg: "A leader_id csak egész szám lehet." },
                    min: { args: [1], msg: "A leader_id csak pozitív szám lehet." },
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
            modelName: "Clan",
            tableName: "clans",
            timestamps: false,

            indexes: [
                {
                    unique: true,
                    fields: ["name"],
                    name: "uq_clans_name",
                },
                {
                    fields: ["leader_id"],
                    name: "ix_clans_leader_id",
                },
            ],

            scopes: {
                public: {
                    attributes: ["id", "name", "leader_id", "created_at"],
                },

                minimal: {
                    attributes: ["id", "name"],
                },
            },

            defaultScope: {
                attributes: ["id", "name", "created_at"],
            },
        }
    );


    return Clan;
}