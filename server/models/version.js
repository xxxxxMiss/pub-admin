const mongoose = require('mongoose')

const Schema = mongoose.Schema

const versionSchema = new Schema({
  createAt: {
    type: Date,
    default: Date.now()
  },
  updateAt: {
    type: Date,
    default: Date.now()
  },
  version: {
    type: String,
    unique: true
  },
  gitUrl: {
    type: String
  },
  name: String,
  remark: String,
  nodeVersion: String,
  buildTool: String,
  branch: String,
  commit: String,
  appid: Number,
  status: [String],
  downloadUrl: [String]
})

module.exports = mongoose.model('Version', versionSchema)
