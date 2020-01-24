const Version = require('../models/version')

exports.createNewVersion = params => {
  return Version.create(params)
}

exports.removeVersionById = id => {
  return Version.findByIdAndRemove(id).exec()
}

exports.updateBuildStatus = (id, status) => {
  // Promise<{n, nModified}>
  return Version.update(
    {
      _id: id,
      status
    },
    { $set: { 'status.$': status } }
  ).exec()
}

exports.getPkgList = params => {
  const { page, pageSize, appid } = params
  const options = {
    limit: pageSize,
    skip: (page - 1) * pageSize
  }
  return Version.find({ appid }, null, options).exec()
}
