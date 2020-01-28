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
  buildAt: {
    type: [
      {
        start: Date,
        end: Date
      }
    ]
  },
  downloadUrl: [String],
  publisher: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

versionSchema.pre('save', function(next) {
  this.updateAt = Date.now()
  next()
})

module.exports = mongoose.model('Version', versionSchema)
