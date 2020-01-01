const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  name: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  createTime: {
    type: Date,
    default: Date.now()
  },
  phone: String,
  collectAppications: [Schema.Types.ObjectId]
})

module.exports = mongoose.model('User', schema)
