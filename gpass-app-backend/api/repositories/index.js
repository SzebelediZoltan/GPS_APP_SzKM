const UserRepository = require("./UserRepository");
const FriendWithRepository = require("./FriendWithRepository");
const ClanRepository = require("./ClanRepository");
const ClanMemberRepository = require("./ClanMemberRepository");
const MarkerRepository = require("./MarkerRepository");

module.exports = (db) =>
{
    const userRepository = new UserRepository(db);
    const friendWithRepository = new FriendWithRepository(db);
    const clanRepository = new ClanRepository(db);
    const clanMemberRepository = new ClanMemberRepository(db);
    const markerRepository = new MarkerRepository(db);


    return {
        userRepository,
        friendWithRepository,
        clanRepository,
        clanMemberRepository,
        markerRepository,
    };
}
