// isomorphic validation for both client and server
const Joi = require('@hapi/joi')

exports.userJoiSchema = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(6)
    .max(16)
    .required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
    .required(),
  repeat_password: Joi.ref('password')
}).with('password', 'repeat_password')
