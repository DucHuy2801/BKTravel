require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const {default: helmet} = require('helmet')
const compression = require('compression')
const bodyParser = require('body-parser')
const app = express();

require("./auth/passport")
require("./models/user.model")

// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json()) 
app.use(express.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

//
require('./database/index')

// init routes
app.use('', require('./routes/api'))

app.use((error , req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
      status: 'error',
      code: statusCode,
      message: error.message || 'Internal Server Error'
    })
  })
  
module.exports = app
