const router = require("express").Router()
const { registerUser, getUser, getAllUser, loginUser, logoutUser } = require('../controllers/authController')
const { addAuthorization } = require('../middleware/verifyToken')

router.post('/register', registerUser)
router.get('/user/search', getUser)
router.get('/user', addAuthorization, getAllUser)
router.post('/login', loginUser)
router.delete('/logout', logoutUser)


module.exports = router