const router = require("express").Router()
const authRouter = require('./authRouter')
const userRouter = require('./userRouter')
const projectRouter = require('./projectRouter')

router.use('/api/v1/auth', authRouter)
router.use('/api/v1/user', userRouter)
router.use('/api/v1/project', projectRouter)
router.get('/test', (req, res) => res.send('server added'))


module.exports = router