const mongoose = require('mongoose')
// const logger = require('log4js')
const config = require('../config')

mongoose.connect(config.mongodb).then(
  () => {
    console.log(`Connect ${config.mongodb} succeed...`)
  },
  err => {
    console.error(`Connect ${config.mongodb} failed`)
    console.error(err)
    process.exit(1)
  }
)

const userSma = require('./user')

exports.User = mongoose.model('User', userSma)
