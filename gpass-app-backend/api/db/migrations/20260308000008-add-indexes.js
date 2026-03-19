'use strict';

// Az egyedi megszorítások (username, email, clan.name) már implicit indexek,
// ezért itt csak azokat az FK oszlopokat indexeljük, amik JOIN-okban
// és WHERE feltételekben a leggyakrabban szerepelnek.
module.exports = {
  async up(queryInterface) {
    // clans: leader_id
    await queryInterface.addIndex('clans', ['leader_id'], {
      name: 'idx_clans_leader_id',
    });

    // clan_members: clan_id, user_id (külön-külön lekérdezésekhez)
    await queryInterface.addIndex('clan_members', ['clan_id'], {
      name: 'idx_clan_members_clan_id',
    });
    await queryInterface.addIndex('clan_members', ['user_id'], {
      name: 'idx_clan_members_user_id',
    });

    // friends_with: sender_id, receiver_id
    await queryInterface.addIndex('friends_with', ['sender_id'], {
      name: 'idx_friends_with_sender_id',
    });
    await queryInterface.addIndex('friends_with', ['receiver_id'], {
      name: 'idx_friends_with_receiver_id',
    });
    // Barátság státusz szerinti szűréshez
    await queryInterface.addIndex('friends_with', ['status'], {
      name: 'idx_friends_with_status',
    });

    // markers: creator_id, marker_type (típus szerinti lekérdezésekhez)
    await queryInterface.addIndex('markers', ['creator_id'], {
      name: 'idx_markers_creator_id',
    });
    await queryInterface.addIndex('markers', ['marker_type'], {
      name: 'idx_markers_marker_type',
    });

    
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('clans',        'idx_clans_leader_id');
    await queryInterface.removeIndex('clan_members', 'idx_clan_members_clan_id');
    await queryInterface.removeIndex('clan_members', 'idx_clan_members_user_id');
    await queryInterface.removeIndex('friends_with', 'idx_friends_with_sender_id');
    await queryInterface.removeIndex('friends_with', 'idx_friends_with_receiver_id');
    await queryInterface.removeIndex('friends_with', 'idx_friends_with_status');
    await queryInterface.removeIndex('markers',      'idx_markers_creator_id');
    await queryInterface.removeIndex('markers',      'idx_markers_marker_type');
  },
};
