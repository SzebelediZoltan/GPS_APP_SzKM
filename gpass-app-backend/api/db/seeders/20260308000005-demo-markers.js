'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT ID, username FROM Users WHERE username IN ('seed_user1', 'seed_user2')`
    );

    const user1 = users.find(u => u.username === 'seed_user1');
    const user2 = users.find(u => u.username === 'seed_user2');

    await queryInterface.bulkInsert('markers',
    [
      {
        creator_id: user1.ID,
        marker_type: 'danger',
        lat: 47.500000,
        lng: 19.050000,
        score: 5,
        created_at: new Date(),
      },
      {
        creator_id: user2.ID,
        marker_type: 'police',
        lat: 47.510000,
        lng: 19.060000,
        score: 3,
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('markers', null);
  },
};