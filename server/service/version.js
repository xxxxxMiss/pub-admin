const Version = require('../models/version')
const buildPackage = require('~js/build-command')

exports.createNewVersion = params => {
  return Version.create(params)
}

exports.removeVersionById = id => {
  return Version.findByIdAndRemove(id).exec()
}

exports.findById = (id, projection) => {
  return Version.find({ _id: id }, projection).exec()
}

exports.updateFieldsById = (id, fields) => {
  return Version.update({ _id: id }, { $set: fields })
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
    skip: (page - 1) * pageSize,
    sort: '-createAt'
  }
  return Version.find({ appid }, null, options)
    .populate('publisher', ['name'])
    .exec()
}
