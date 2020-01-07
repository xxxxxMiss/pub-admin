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
