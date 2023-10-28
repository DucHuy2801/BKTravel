require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const {default: helmet} = require('helmet')
const compression = require('compression')
const mysql = require('mysql')
const app = express();

// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json()) 
app.use(express.urlencoded({
  extended: true
}))

// init datbase
require('./database/init.mysql')

// init routes
app.use('', require('./routes/auth.route'))

app.use((error , req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
      status: 'error',
      code: statusCode,
      message: error.message || 'Internal Server Error'
    })
  })
  
module.exports = app
