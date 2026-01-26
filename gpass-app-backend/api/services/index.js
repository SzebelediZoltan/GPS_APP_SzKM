const UserService = require("./UserService");
const FriendWithService = require("./FriendWithService");
const ClanService = require("./ClanService");
const ClanMemberService = require("./ClanMemberService");
const MarkerService = require("./MarkerService");
const TripService = require("./TripService");
const TripPointService = require("./TripPointService");

module.exports = (db) => {
    const userService = new UserService(db);
    const friendWithService = new FriendWithService(db);
    const clanService = new ClanService(db);
    const clanMemberService = new ClanMemberService(db);
    const markerService = new MarkerService(db);
    const tripService = new TripService(db);
    const tripPointService = new TripPointService(db);

    return {
        userService,
        friendWithService,
        clanService,
        clanMemberService,
        markerService,
        tripService,
        tripPointService
    };
}
