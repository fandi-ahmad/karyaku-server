const router = require("express").Router()
const { createProject, getProjectListByUser } = require('../controllers/projectController')
const { addAuthorization } = require('../middleware/verifyToken')

router.post('/create', addAuthorization, createProject)
router.get('/:uuid_user', addAuthorization, getProjectListByUser)


module.exports = router