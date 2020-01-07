const Application = require('../models/application')

exports.create = params => {
  return Application.create(params)
}

exports.getList = async (ctx, params) => {
  // TODO: number type from client to here is string?
  let { page, pageSize, sortField, sortOrder } = params
  page = Number(page) || 1
  pageSize = Number(pageSize) || 10
  const opt = {
    limit: pageSize,
    skip: (page - 1) * pageSize,
    sort: {
      [sortField]: sortOrder
    }
  }
  let list = await Application.find({}, null, opt)
    .populate('collectedByUsers', '_id')
    .exec()

  list = (list || []).map(item => {
    item = item.toObject()
    item.isCollected = !!item.collectedByUsers.find(user => {
      return user._id.equals(ctx.session.user._id)
    })
    return item
  })
  const total = await exports.getCountByQuery()
  return { list, total, pageSize, page }
}

exports.getCountByQuery = (query = {}) => {
  return Application.countDocuments(query)
}

exports.getApplicationById = id => {
  return Application.findById(id)
}
