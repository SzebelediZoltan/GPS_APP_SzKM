'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trip_points',
    {
      id:
      {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      trip_id:
      {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,

        references:
        {
          model: 'trips',
          key: 'id',
        },
      },

      lat:
      {
        type: Sequelize.DataTypes.DECIMAL(9, 6),
        allowNull: false,
      },

      lng:
      {
        type: Sequelize.DataTypes.DECIMAL(9, 6),
        allowNull: false,
      },

      recorded_at:
      {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('trip_points');
  },
};
