const { User, User_profile } = require('../models')
const { v4: uuidv4 } = require('uuid')
const { sign, verify } = require('jsonwebtoken')
const { genSalt, hash, compare } = require('bcrypt')
const { Op } = require('sequelize')

const getUserProfileByUuid = async (req, res) => {
  try {
    const { uuid_user } = req.params
    const user = await User_profile.findAll({
      where: {
        uuid_user: uuid_user
      }
    })
    res.status(200).json({ status: 200, message: 'ok', data: user[0] })

  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- error get user profile by uuid');
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const { uuid_user, username, fullname, category, profile_picture, address, work, link, biodata, tag } = req.body

    await User.update({ username: username }, {
      where: { uuid: uuid_user }
    })

    await User_profile.update({
      fullname: fullname,
      category: category,
      profile_picture: profile_picture,
      address: address,
      work: work,
      link: link,
      biodata: biodata,
      tag: tag
    }, {
      where: { uuid_user: uuid_user }
    })

    res.status(200).json({ status: 200, message: 'update user profile successfully' })

  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- error update user profile');
  }
}

module.exports = { getUserProfileByUuid, updateUserProfile }