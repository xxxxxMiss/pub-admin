const User = require('../models/user')

exports.createUser = params => {
  return User.create(params)
}

exports.login = params => {}
