const router = require("express").Router()
const authRouter = require('./authRouter')
const userRouter = require('./userRouter')

router.use('/api/v1/auth', authRouter)
router.use('/api/v1/user', userRouter)


module.exports = router