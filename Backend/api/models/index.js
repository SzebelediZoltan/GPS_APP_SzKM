module.exports = (sequelize) =>
{
    const User = require("./User")(sequelize);

    const Order = require("./Order")(sequelize);

    User.hasMany(Order, 
    {
        foreignKey: "userID",

        as: "orders",

        constraints: false,
    });

    Order.belongsTo(User, 
    {
        foreignKey: "userID",

        as: "user",

        constraints: false,
    });

    return { User, Order };
}