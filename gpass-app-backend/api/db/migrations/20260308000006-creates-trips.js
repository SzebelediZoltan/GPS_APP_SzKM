'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trips',
    {
      id:
      {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      user_id:
      {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,

        references:
        {
          model: 'Users',
          key: 'ID',
        },
      },

      trip_name:
      {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('trips');
  },
};
