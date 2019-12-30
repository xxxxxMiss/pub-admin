const mongoose = require('mongoose')

const Schema = mongoose.Schema

const versionSchema = new Schema({
  createTime: {
    type: Date,
    default: Date.now()
  },
  name: String,
  remark: String,
  nodeVersion: String,
  buildTool: String,
  branch: String,
  commit: String
})

module.exports = mongoose.model('Version', versionSchema)
