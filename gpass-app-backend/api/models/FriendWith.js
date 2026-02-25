const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class FriendWith extends Model { };

    FriendWith.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            sender_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: "A sender_id megadása kötelező." },
                    isInt: { msg: "A sender_id csak egész szám lehet." },
                    min: { args: [1], msg: "A sender_id csak pozitív szám lehet." },
                },

                onDelete: "CASCADE"
            },

            receiver_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: "A receiver_id megadása kötelező." },
                    isInt: { msg: "A receiver_id csak egész szám lehet." },
                    min: { args: [1], msg: "A receiver_id csak pozitív szám lehet." },

                    notSameAsSender(value) {
                        // Figyelj: itt a this.sender_id elérhető validáció közben
                        if (value === this.sender_id) {
                            throw new Error("Nem küldhetsz barátkérelmet saját magadnak.");
                        }
                    },
                },

                onDelete: "CASCADE"
            },

            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "sent",
                validate: {
                    notNull: { msg: "Az állapot (status) megadása kötelező." },
                    notEmpty: { msg: "Az állapot (status) nem lehet üres." },
                    isIn: {
                        args: [["sent", "accepted"]],
                        msg: "Az állapot (status) csak 'sent' vagy 'accepted' lehet.",
                    },
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
            modelName: "FriendWith",
            tableName: "friends_with",
            timestamps: false,

            // Dupla request ellen védelem ugyanarra a párra (irány szerint)
            // (Ha azt is akarod, hogy A->B és B->A se lehessen külön, azt DB szinten érdemes trükközni,
            // de ezt most legalább A->B duplázás ellen védi.)
            indexes: [
                {
                    unique: true,
                    fields: ["sender_id", "receiver_id"],
                    name: "uq_friends_sender_receiver",
                },
            ],

            scopes: {
                public: {
                    attributes: ["id", "sender_id", "receiver_id", "status", "created_at"],
                },

                accepted: {
                    where: { status: "accepted" },
                    attributes: ["id", "sender_id", "receiver_id", "status" ,"created_at"],
                },

                pending: {
                    where: { status: "sent" },
                    attributes: ["id", "sender_id", "receiver_id", "status", "created_at"],
                },

                minimal: {
                    attributes: ["id", "sender_id", "receiver_id", "status"],
                },
            },

            defaultScope: {
                attributes: ["id", "sender_id", "receiver_id", "status", "created_at"],
            },
        }
    );


    return FriendWith;
}