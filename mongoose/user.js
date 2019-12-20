const Schema = require('mongoose').Schema

const userSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  password: {
    type: String
  }
})

module.exports = userSchema
