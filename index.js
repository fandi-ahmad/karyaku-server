const express = require('express')
const app = express()
const port = 8000
const router = require('./routes/router')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { config } = require('dotenv')

config()
const corsOptions = {
  origin: process.env.KARYAKU_FRONTEND_CORS,
  credentials: true, 
};

app.use(cors(corsOptions))
app.use(cookieParser());
app.use(express.json())
app.use(router)

app.listen(port, () => {
  console.log(`karyaku server listening on port ${port}`)
})