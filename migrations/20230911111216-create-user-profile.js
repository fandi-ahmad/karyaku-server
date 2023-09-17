'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User_profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      uuid_user: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      fullname: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      profile_picture: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      work: {
        type: Sequelize.STRING
      },
      link: {
        type: Sequelize.STRING
      },
      biodata: {
        type: Sequelize.TEXT
      },
      tag: {
        type: Sequelize.STRING
      },
      generation: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('User_profiles');
  }
};