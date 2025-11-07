module.exports = (sequelize) =>
{
    const User = require("./User")(sequelize);

    const Location = require("./Location")(sequelize);

    User.hasMany(Location, 
    {
        foreignKey: "userID",

        as: "locations",

        constraints: false,
    });

    Location.belongsTo(User, 
    {
        foreignKey: "userID",

        as: "user",

        constraints: false,
    });

    return { User, Location };
}