const router = require("express").Router()
const { getUserProfileByUuid, updateUserProfile } = require('../controllers/userController')
const { addAuthorization } = require('../middleware/verifyToken')

router.get('/profile/:uuid_user', addAuthorization, getUserProfileByUuid)
router.put('/update', addAuthorization, updateUserProfile)


module.exports = router