module.exports = (sequelize) =>
{
    const User = require("./User")(sequelize);
    const Marker = require("./Marker")(sequelize);

    const Clan = require("./Clan")(sequelize);
    const ClanMember = require("./ClanMember")(sequelize);

    const FriendWith = require("./FriendWith")(sequelize);

    const Trip = require("./Trip")(sequelize);
    const TripPoint = require("./TripPoint")(sequelize);

    // =========================
    // USER <-> MARKER
    // =========================
    User.hasMany(Marker,
    {
        foreignKey: "creator_id",
        as: "markers",
        constraints: false,
    });

    Marker.belongsTo(User,
    {
        foreignKey: "creator_id",
        as: "creator",
        constraints: false,
    });

    // =========================
    // CLAN (leader) -> USER
    // =========================
    User.hasMany(Clan,
    {
        foreignKey: "leader_id",
        as: "ownedClans",
        constraints: false,
    });

    Clan.belongsTo(User,
    {
        foreignKey: "leader_id",
        as: "leader",
        constraints: false,
    });

    // =========================
    // CLAN MEMBERS: CLAN <-> USER (through ClanMember)
    // =========================
    Clan.hasMany(ClanMember,
    {
        foreignKey: "clan_id",
        as: "members",
        constraints: false,
    });

    ClanMember.belongsTo(Clan,
    {
        foreignKey: "clan_id",
        as: "clan",
        constraints: false,
    });

    User.hasMany(ClanMember,
    {
        foreignKey: "user_id",
        as: "clanMemberships",
        constraints: false,
    });

    ClanMember.belongsTo(User,
    {
        foreignKey: "user_id",
        as: "user",
        constraints: false,
    });

    // (Opcionális, de kényelmes) Many-to-many shortcut:
    // Clan.getUsers() / User.getClans()
    Clan.belongsToMany(User,
    {
        through: ClanMember,
        foreignKey: "clan_id",
        otherKey: "user_id",
        as: "users",
        constraints: false,
    });

    User.belongsToMany(Clan,
    {
        through: ClanMember,
        foreignKey: "user_id",
        otherKey: "clan_id",
        as: "clans",
        constraints: false,
    });

    // =========================
    // Friend_WITH: User <-> User (sender/receiver)
    // =========================
    User.hasMany(FriendWith,
    {
        foreignKey: "sender_id",
        as: "sentFriendRequests",
        constraints: false,
    });

    FriendWith.belongsTo(User,
    {
        foreignKey: "sender_id",
        as: "sender",
        constraints: false,
    });

    User.hasMany(FriendWith,
    {
        foreignKey: "receiver_id",
        as: "receivedFriendRequests",
        constraints: false,
    });

    FriendWith.belongsTo(User,
    {
        foreignKey: "receiver_id",
        as: "receiver",
        constraints: false,
    });

    // =========================
    // TRIPS: USER -> TRIP -> TRIP_POINTS
    // =========================
    User.hasMany(Trip,
    {
        foreignKey: "user_id",
        as: "trips",
        constraints: false,
    });

    Trip.belongsTo(User,
    {
        foreignKey: "user_id",
        as: "user",
        constraints: false,
    });

    Trip.hasMany(TripPoint,
    {
        foreignKey: "trip_id",
        as: "points",
        constraints: false,
    });

    TripPoint.belongsTo(Trip,
    {
        foreignKey: "trip_id",
        as: "trip",
        constraints: false,
    });

    return { 
        User, 
        Marker, 
        Clan, 
        ClanMember, 
        FriendWith, 
        Trip, 
        TripPoint 
    };
}
