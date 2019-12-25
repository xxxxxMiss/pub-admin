const { createUser, login } = require('../service/user')

exports.login = ctx => {
  const query = ctx.query
  if (query.name != 'admin') {
    ctx.status = 200
    ctx.body = {
      code: 'USER_INVALID',
      message: '当前用户无权限访问'
    }
  } else {
    ctx.status = 200
    ctx.body = {
      code: 0
    }
  }
}
