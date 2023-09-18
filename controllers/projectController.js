const { User_project, sequelize } = require('../models')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const fs = require('fs')

const removeImage = (filePath) => {
  // get location image
  filePath = path.join(__dirname, '..', filePath)

  // remove file by path
  fs.unlink(filePath, err => console.log(err, '<-- error remove image'))
}

const createProject = async (req, res) => {
  try {
    const { uuid_user, title, description, tag, demo_link, source_code } = req.body
    const image_upload = req.file.path
    const randomUUID = uuidv4()


    await User_project.create({
      uuid: randomUUID,
      uuid_user: uuid_user,
      project_image: image_upload,
      title: title,
      description: description,
      tag: tag,
      demo_link: demo_link,
      source_code: source_code
    })

    res.status(200).json({ status: 200, message: 'create project successfully' })

  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- error create project');
  }
}

const getProjectListByUser = async (req, res) => {
  try {
    const { uuid_user } = req.params

    const dataProject = await User_project.findAll({
      where: {
        uuid_user: uuid_user
      }
    })

    res.status(200).json({ status: 200, message: 'ok', data: dataProject })

  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- error get project list by user');
  }
}

const getAllProjectList = async (req, res) => {
  try {
    const rawQuery = /*sql*/`
      SELECT 
        user_projects.id, user_projects.uuid, users.username, user_profiles.profile_picture,
        user_projects.project_image, user_projects.title, user_projects.description, 
        user_projects.demo_link, user_projects.source_code, user_projects.createdAt
      FROM users
      JOIN user_profiles ON (users.uuid = user_profiles.uuid_user)
      JOIN user_projects ON (users.uuid = user_projects.uuid_user)
      ORDER BY user_projects.createdAt DESC;
    `

    const dataProject = await sequelize.query(rawQuery)
    res.status(200).json({ status: 200, message: 'ok', data: dataProject[0] })
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- error get project list');
  }
}

const updateProject = async (req, res) => {
  try {
    const { uuid_user, uuid, title, description, tag, demo_link, source_code } = req.body

    const userProject = await User_project.findAll({
      where: { uuid: uuid }
    })

    if (req.file) {
      const image_upload = req.file.path
      if (userProject[0].project_image === '') {
        userProject[0].project_image = image_upload
      } else {
        removeImage(userProject[0].project_image)
        userProject[0].project_image = image_upload
      }
    }

    userProject[0].title = title
    userProject[0].description = description
    userProject[0].tag = tag
    userProject[0].demo_link = demo_link
    userProject[0].source_code = source_code
    userProject[0].save()

    res.status(200).json({ status: 200, message: 'update project successfully', data: userProject[0] })

  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- error update project');
  }
}

const deleteProject = async (req, res) => {
  try {
    const { uuid } = req.params
    const userProject = await User_project.findAll({
      where: { uuid: uuid }
    })

    if (!userProject[0]) {
      return res.status(404).json({
        status: 404,
        message: 'data is not found'
      })
    }

    removeImage(userProject[0].project_image)
    userProject[0].destroy()
    res.json({ status: 200, message: 'delete successfully' })
    
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error' });
    console.log(error, '<-- error delete project');
  }
}


module.exports = { createProject, getProjectListByUser, getAllProjectList, updateProject, deleteProject }