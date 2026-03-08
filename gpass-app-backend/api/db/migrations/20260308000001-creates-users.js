'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users',
    {
      ID:
      {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      username:
      {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      email:
      {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      password:
      {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      status:
      {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },

      isAdmin:
      {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      latitude:
      {
        type: Sequelize.DataTypes.DECIMAL(9, 6),
        allowNull: true,
      },

      longitude:
      {
        type: Sequelize.DataTypes.DECIMAL(9, 6),
        allowNull: true,
      },

      registeredAt:
      {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
