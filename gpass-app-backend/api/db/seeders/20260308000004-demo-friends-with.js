'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT ID, username FROM Users WHERE username IN ('seed_user1', 'seed_user2', 'seed_user3')`
    );

    const user1 = users.find(u => u.username === 'seed_user1');
    const user2 = users.find(u => u.username === 'seed_user2');
    const user3 = users.find(u => u.username === 'seed_user3');

    await queryInterface.bulkInsert('friends_with',
    [
      {
        sender_id: user1.ID,
        receiver_id: user2.ID,
        status: 'sent',
        created_at: new Date(),
      },
      {
        sender_id: user2.ID,
        receiver_id: user3.ID,
        status: 'accepted',
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('friends_with', null);
  },
};
