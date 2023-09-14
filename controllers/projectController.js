const { User_project } = require('../models')
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
    console.log(req, '<-- semua request');
    console.log(req.file, '<-- request file jika ada');
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

module.exports = { createProject, getProjectListByUser }
