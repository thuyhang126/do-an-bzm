'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
    * Add altering commands here.
    *
    * Example:
    * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      social_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      provider: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      birthday: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      public: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      purpose: {
        type: Sequelize.STRING(1200),
        allowNull: true,
      },
      descriptions: {
        type: Sequelize.STRING,
      },
      invite_code: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      register_code: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      company: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      position: {
        type: Sequelize.STRING(64),
        allowNull: true,
        defaultValue: null
      },
      card_visit: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      business_model: {
        type: Sequelize.STRING(1200),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'online'
      },
      created_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
    * Add reverting commands here.
    *
    * Example:
    * await queryInterface.dropTable('users');
    */
    await queryInterface.dropTable('users');
  }
};
