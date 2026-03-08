'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = bcrypt.hashSync('TestPassword123', 14);

    await queryInterface.bulkInsert('Users',
    [
      {
        username: 'seed_admin',
        email: 'seed_admin@example.com',
        password: hashedPassword,
        isAdmin: true,
        status: null,
        latitude: null,
        longitude: null,
        registeredAt: new Date(),
      },
      {
        username: 'seed_user1',
        email: 'seed_user1@example.com',
        password: hashedPassword,
        isAdmin: false,
        status: 'online',
        latitude: 47.497900,
        longitude: 19.040200,
        registeredAt: new Date(),
      },
      {
        username: 'seed_user2',
        email: 'seed_user2@example.com',
        password: hashedPassword,
        isAdmin: false,
        status: null,
        latitude: null,
        longitude: null,
        registeredAt: new Date(),
      },
      {
        username: 'seed_user3',
        email: 'seed_user3@example.com',
        password: hashedPassword,
        isAdmin: false,
        status: null,
        latitude: null,
        longitude: null,
        registeredAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users',
    {
      username: ['seed_admin', 'seed_user1', 'seed_user2', 'seed_user3'],
    });
  },
};
