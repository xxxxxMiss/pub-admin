const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  appName: {
    type: String,
    unique: true
  },
  appDesc: {
    type: String
  },
  appGitAddr: {
    type: String,
    unique: true
  },
  appLanguage: {
    type: String
  },
  appId: {
    // gitlab为每个仓库分配的id
    type: Number,
    unique: true
  },
  createTime: {
    type: Date,
    default: Date.now()
  },
  collectedByUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

module.exports = mongoose.model('Application', schema)
