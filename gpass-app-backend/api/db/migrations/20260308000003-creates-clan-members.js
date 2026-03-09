'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clan_members',
    {
      clan_id:
      {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,

        references:
        {
          model: 'clans',
          key: 'id',
        },
      },

      user_id:
      {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,

        references:
        {
          model: 'Users',
          key: 'ID',
        },
      },

      joined_at:
      {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('clan_members');
  },
};
