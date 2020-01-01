const Application = require('../models/application')

exports.create = params => {
  return Application.create(params)
}

exports.getList = async params => {
  // TODO: number type from client to here is string?
  let { page, pageSize, ...sort } = params
  page = Number(page) || 1
  pageSize = Number(pageSize) || 10
  const opt = {
    limit: pageSize,
    skip: (page - 1) * pageSize,
    sort
  }
  const list = await Application.find({}, null, opt).exec()
  const total = await exports.getCountByQuery()
  return { list, total, pageSize, page }
}

exports.getCountByQuery = (query = {}) => {
  return Application.countDocuments(query)
}
