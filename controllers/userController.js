const { User, User_profile } = require('../models')
const { v4: uuidv4 } = require('uuid')
const { sign, verify } = require('jsonwebtoken')
const { genSalt, hash, compare } = require('bcrypt')
const { Op } = require('sequelize')
const path = require('path')
const fs = require('fs')

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

const getUserProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params

    const user = await User.findAll({
      where: { username: username }
    })

    if (user[0]) {
      const userProfile = await User_profile.findAll({
        where: { uuid_user: user[0].dataValues.uuid }
      })

      res.status(200).json({ status: 200, message: 'ok', data: userProfile[0] })
    } else {
      res.status(404).json({ status: 404, message: 'username is not found' })
    }

  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- error get user profile by username');
  }
}

const removeImage = (filePath) => {
  // get location image
  filePath = path.join(__dirname, '..', filePath)

  // remove file by path
  fs.unlink(filePath, err => console.log(err, '<-- error remove image'))
}

const updateUserProfile = async (req, res) => {
  try {
    const { uuid_user, username, fullname, category, address, work, link, biodata, tag } = req.body

    const userByUsername = await User.findAll({
      where: {
        username: username,
        uuid: {
          [Op.not]: uuid_user
        }
      }
    });

    if (userByUsername.length > 0) {
      return res.status(400).json({ status: 400, message: 'username not available' });
    }

    await User.update({ username: username }, {
      where: { uuid: uuid_user }
    })

    const userProfile = await User_profile.findAll({
      where: { uuid_user: uuid_user }
    })

    if (req.file) {
      const image_upload = req.file.path
      if (userProfile[0].profile_picture === '') {
        userProfile[0].profile_picture = image_upload
      } else {
        removeImage(userProfile[0].profile_picture)
        userProfile[0].profile_picture = image_upload
      }
    }

    userProfile[0].fullname = fullname
    userProfile[0].category = category
    userProfile[0].address = address
    userProfile[0].work = work
    userProfile[0].link = link
    userProfile[0].biodata = biodata
    userProfile[0].tag = tag
    userProfile[0].save()
   

    res.status(200).json({ 
      status: 200, 
      message: 'update user profile successfully'
    })

  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- error update user profile');
  }
}

module.exports = { getUserProfileByUuid, updateUserProfile, getUserProfileByUsername }