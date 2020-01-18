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

exports.getPkgList = params => {
  const { page, pageSize, appid } = params
  const options = {
    limit: pageSize,
    skip: (page - 1) * pageSize
  }
  return Version.find({ appid }, null, options).exec()
}
