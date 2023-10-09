const express = require('express')
const app = express()
const router = require('./routes/router')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { config } = require('dotenv')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const { fileStorage, filterFormat } = require('./middleware/filterImage')


config()
const port = process.env.KARYAKU_PORT_SERVER || 8000
const corsOptions = {
  origin: process.env.KARYAKU_FRONTEND_CORS,
  credentials: true, 
};

app.use(cors(corsOptions))
app.use(cookieParser());
// app.use(express.json())
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(multer({storage: fileStorage, fileFilter: filterFormat}).single('image_upload'))
app.use(router)

app.listen(port, () => {
  console.log(`karyaku server listening on port ${port}`)
})