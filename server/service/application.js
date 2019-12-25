const Application = require('../models/application')

exports.create = params => {
  return Application.create(params)
}

exports.getList = params => {
  const res = Application.find().exec()
  return res
}
