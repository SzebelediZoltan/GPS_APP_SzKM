'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [trips] = await queryInterface.sequelize.query(
      `SELECT id, trip_name FROM trips WHERE trip_name IN ('SeedTrip1', 'SeedTrip2')`
    );

    const trip1 = trips.find(t => t.trip_name === 'SeedTrip1');
    const trip2 = trips.find(t => t.trip_name === 'SeedTrip2');

    await queryInterface.bulkInsert('trip_points',
    [
      { trip_id: trip1.id, lat: 47.500000, lng: 19.050000, recorded_at: new Date() },
      { trip_id: trip1.id, lat: 47.510000, lng: 19.060000, recorded_at: new Date() },
      { trip_id: trip2.id, lat: 47.520000, lng: 19.070000, recorded_at: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('trip_points', null);
  },
};
