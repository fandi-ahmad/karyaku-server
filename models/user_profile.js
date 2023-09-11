'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_profile.belongsTo(models.User, { foreignKey: 'uuid_user' })
    }
  }
  User_profile.init({
    uuid_user: DataTypes.STRING,
    uuid: DataTypes.STRING,
    fullname: DataTypes.STRING,
    category: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
    address: DataTypes.STRING,
    work: DataTypes.STRING,
    link: DataTypes.STRING,
    biodata: DataTypes.TEXT,
    tag: DataTypes.STRING,
    generation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User_profile',
  });
  return User_profile;
};