const User = require('../mongoose').User

module.exports = {
  create(user) {
    return User.create(user)
  }
}
