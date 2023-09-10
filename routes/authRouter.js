const router = require("express").Router()
const { registerUser, getUser, getAllUser, loginUser, logoutUser, getUserLogin, updateUserProfile } = require('../controllers/authController')
const { addAuthorization, checkAuthInLogin } = require('../middleware/verifyToken')

router.post('/register', registerUser)
router.get('/user/search', getUser)
router.get('/user', addAuthorization, getAllUser)
router.post('/login', loginUser)
router.delete('/logout', logoutUser)
router.get('/user-login', addAuthorization, getUserLogin)
router.put('/user/update', addAuthorization, updateUserProfile)


module.exports = router