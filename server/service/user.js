const User = require('../models/user')

exports.createUser = params => {
  return User.create(params)
}

exports.getUserByName = name => {
  return User.findOne({ name }).exec()
}
