'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clans',
    {
      id:
      {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      name:
      {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      description:
      {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },

      leader_id:
      {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,

        references:
        {
          model: 'Users',
          key: 'ID',
        },
      },

      created_at:
      {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('clans');
  },
};
