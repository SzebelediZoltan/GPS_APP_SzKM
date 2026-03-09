'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('markers',
    {
      id:
      {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      creator_id:
      {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,

        references:
        {
          model: 'Users',
          key: 'ID',
        },
      },

      marker_type:
      {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      score:
      {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

      created_at:
      {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('markers');
  },
};
