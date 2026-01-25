module.exports = (sequelize) =>
{
    const User = require("./User")(sequelize);
    const Location = require("./Location")(sequelize);
    const Marker = require("./Marker")(sequelize);

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
    
    User.hasMany(Marker, 
    {
        foreignKey: "userID",

        as: "Markers",

        constraints: false,
    });

    Marker.belongsTo(User, 
    {
        foreignKey: "userID",

        as: "user",

        constraints: false,
    });

    return { User, Location, Marker};
}