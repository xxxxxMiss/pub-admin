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
  collectAppications: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Application'
    }
  ]
})

module.exports = mongoose.model('User', schema)
