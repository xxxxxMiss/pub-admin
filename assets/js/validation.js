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

exports.versionJoiSchema = Joi.object({
  version: Joi.string().required(),
  name: Joi.string()
    .alphanum()
    .required(),
  nodeVersion: Joi.required(),
  remark: Joi.string().max(200),
  gitUrl: Joi.string()
    .uri({
      scheme: ['git', /git\+https?/, /https?/]
    })
    .required(),
  branch: Joi.string().required(),
  commit: Joi.string().required(),
  buildTool: Joi.string().required(),
  appid: Joi.number().required()
})
