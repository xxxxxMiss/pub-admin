const Version = require('../models/version')
const dayjs = require('dayjs')

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

exports.search = params => {
  let { start, end, qs, appid } = params
  const $or = []
  if (qs) {
    $or.push({
      version: {
        $regex: qs,
        $options: 'imx'
      }
    })
    $or.push({
      name: {
        $regex: qs,
        $options: 'imx'
      }
    })
  }
  if (start || end) {
    start = dayjs(start).toISOString()
    end = dayjs(end).toISOString()
    $or.push({
      createAt: {
        $lte: end,
        $gte: start
      }
    })
  }

  const query = { appid }
  if ($or.length > 0) {
    query.$or = $or
  }

  return Version.find(query).exec()
}
