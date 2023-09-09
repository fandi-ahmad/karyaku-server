const router = require("express").Router()
const authRouter = require('./authRouter')

router.use('/api/v1/auth', authRouter)


module.exports = router