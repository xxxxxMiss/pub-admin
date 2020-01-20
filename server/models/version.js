const mongoose = require('mongoose')

const Schema = mongoose.Schema

const versionSchema = new Schema({
  createTime: {
    type: Date,
    default: Date.now()
  },
  version: {
    type: String,
    unique: true
  },
  gitUrl: {
    type: String,
    unique: true
  },
  name: String,
  remark: String,
  nodeVersion: String,
  buildTool: String,
  branch: String,
  commit: String,
  appid: Number,
  status: [String]
})

module.exports = mongoose.model('Version', versionSchema)
