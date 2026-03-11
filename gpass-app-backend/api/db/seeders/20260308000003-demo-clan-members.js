'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT ID, username FROM Users WHERE username IN ('seed_user1', 'seed_user2', 'seed_user3')`
    );
    const [clans] = await queryInterface.sequelize.query(
      `SELECT id, name FROM clans WHERE name IN ('SeedClan One', 'SeedClan Two')`
    );

    const user1 = users.find(u => u.username === 'seed_user1');
    const user2 = users.find(u => u.username === 'seed_user2');
    const user3 = users.find(u => u.username === 'seed_user3');
    const clan1 = clans.find(c => c.name === 'SeedClan One');
    const clan2 = clans.find(c => c.name === 'SeedClan Two');

    await queryInterface.bulkInsert('clan_members',
    [
      { clan_id: clan1.id, user_id: user1.ID, joined_at: new Date() },
      { clan_id: clan2.id, user_id: user2.ID, joined_at: new Date() },
      { clan_id: clan1.id, user_id: user3.ID, joined_at: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('clan_members', null);
  },
};