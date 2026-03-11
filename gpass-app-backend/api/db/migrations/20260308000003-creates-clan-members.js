'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clan_members', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      clan_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,

        references: {
          model: 'clans',
          key: 'id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      user_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,

        references: {
          model: 'Users',
          key: 'ID',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      role: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'member',
      },

      joined_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Ne lehessen ugyanaz a user kétszer ugyanabban a klánban
    await queryInterface.addConstraint('clan_members', {
      fields: ['clan_id', 'user_id'],
      type: 'unique',
      name: 'unique_clan_member',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('clan_members');
  },
};