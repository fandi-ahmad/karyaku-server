const router = require("express").Router()
const { getUserProfileByUuid, updateUserProfile, getUserProfileByUsername } = require('../controllers/userController')
const { addAuthorization } = require('../middleware/verifyToken')

router.get('/profile/:uuid_user', addAuthorization, getUserProfileByUuid)
router.put('/update', addAuthorization, updateUserProfile)
router.get('/profile/username/:username', getUserProfileByUsername)


module.exports = router