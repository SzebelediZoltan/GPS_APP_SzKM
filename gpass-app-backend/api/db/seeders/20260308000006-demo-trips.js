'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT ID, username FROM Users WHERE username IN ('seed_user1', 'seed_user2')`
    );

    const user1 = users.find(u => u.username === 'seed_user1');
    const user2 = users.find(u => u.username === 'seed_user2');

    await queryInterface.bulkInsert('trips',
    [
      {
        user_id: user1.ID,
        trip_name: 'SeedTrip1',
        created_at: new Date(),
      },
      {
        user_id: user2.ID,
        trip_name: 'SeedTrip2',
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('trips',
    {
      trip_name: ['SeedTrip1', 'SeedTrip2'],
    });
  },
};