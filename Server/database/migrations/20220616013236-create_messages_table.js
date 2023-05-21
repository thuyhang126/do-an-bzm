'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('messages', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('messages', {
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      receiver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      seen_at: {
        type: Sequelize.DATE,
      },
      sent_at: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('messages');
     */
    await queryInterface.dropTable('messages');
  }
};
