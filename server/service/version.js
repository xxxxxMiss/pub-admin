const Version = require('../models/version')

exports.createVersion = params => {
  return Version.create(params)
}
