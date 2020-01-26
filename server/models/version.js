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
  status: {
    type: [String],
    default: ['empty', 'empty', 'empty']
  },
  downloadUrl: [String],
  publisher: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Version', versionSchema)
