const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) =>
{
    class Order extends Model {};

    Order.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            product_name:
            {
                type: DataTypes.STRING,
                allowNull: false,
                unique: "ordername"
            },

            price:
            {
                type: DataTypes.FLOAT,
                allowNull: false,

                validate:
                {
                    isNumeric: true,
                }
            }
        },

        {
            sequelize,
            modelName: "Order",
            createdAt: "orderedAt",
            updatedAt: false,
        },
    );

    return Order;
}