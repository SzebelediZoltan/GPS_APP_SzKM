const { Model, DataTypes } = require("sequelize");

const authUtils = require("../utilities/authUtils");

module.exports = (sequelize) => {
    class User extends Model { };

    User.init
        (
            {
                ID:
                {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },

                username:
                {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: "username"
                },


                email:
                {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: "email",

                    validate:
                    {
                        isEmail:
                        {
                            args: true,

                            msg: "Nem megfelelő email formátum",
                        }
                    }
                },

                password:
                {
                    type: DataTypes.STRING,
                    allowNull: false,

                    set(value) {
                        this.setDataValue("password", authUtils.hashPassword(value));
                    }
                },

                isAdmin:
                {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                }
            },

            {
                sequelize,
                modelName: "User",
                createdAt: "registeredAt",
                updatedAt: false,
                
                scopes: {
                    public: {
                        attributes: ["ID", "username", "email", "isAdmin"]
                    },

                    auth: {
                        attributes: ["password"]
                    }
                }
            },
        );

    return User;
}