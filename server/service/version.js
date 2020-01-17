const Version = require('../models/version')

exports.createVersion = params => {
  return Version.create(params)
}

exports.createNewVersion = params => {
  return Version.create(params)
}

exports.removeVersionById = id => {
  return Version.findByIdAndRemove(id).exec()
}
