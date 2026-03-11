'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT ID, username FROM Users WHERE username IN ('seed_user1', 'seed_user2')`
    );

    const user1 = users.find(u => u.username === 'seed_user1');
    const user2 = users.find(u => u.username === 'seed_user2');

    await queryInterface.bulkInsert('clans',
    [
      {
        name: 'SeedClan One',
        leader_id: user1.ID,
        description: 'Az első seed klán',
        created_at: new Date(),
      },
      {
        name: 'SeedClan Two',
        leader_id: user2.ID,
        description: 'A második seed klán',
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('clans',
    {
      name: ['SeedClan One', 'SeedClan Two'],
    });
  },
};