const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class ClanMember extends Model { };

    ClanMember.init(
        {
            clan_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: "A clan_id megadása kötelező." },
                    isInt: { msg: "A clan_id csak egész szám lehet." },
                    min: { args: [1], msg: "A clan_id csak pozitív szám lehet." },
                },

                onDelete: "CASCADE",
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

            joined_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "ClanMember",
            tableName: "clan_members",
            timestamps: false,

            indexes: [
                {
                    unique: true,
                    fields: ["clan_id", "user_id"],
                    name: "uq_clan_members_clan_user",
                },
                {
                    fields: ["clan_id"],
                    name: "ix_clan_members_clan_id",
                },
                {
                    fields: ["user_id"],
                    name: "ix_clan_members_user_id",
                },
            ],

            scopes: {
                public: {
                    attributes: ["clan_id", "user_id", "joined_at"],
                },

                minimal: {
                    attributes: ["clan_id", "user_id"],
                },
            },

            defaultScope: {
                attributes: ["clan_id", "user_id", "joined_at"],
            },
        }
    );


    return ClanMember;
}