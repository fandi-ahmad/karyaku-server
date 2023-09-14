'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_project.belongsTo(models.User, { foreignKey: 'uuid_user' })
    }
  }
  User_project.init({
    uuid: DataTypes.STRING,
    uuid_user: DataTypes.STRING,
    project_image: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    tag: DataTypes.STRING,
    demo_link: DataTypes.STRING,
    source_code: DataTypes.STRING,
    is_archive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User_project',
  });
  return User_project;
};