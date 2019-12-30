const { createUser, getUserByName } = require('../service/user')
const shajs = require('sha.js')

exports.login = async ctx => {
  const { name, password } = ctx.query
  const userinfo = await getUserByName(name)
  if (!userinfo) {
    ctx.body = {
      code: 'USER_NOT_FOUND',
      message: '用户不存在'
    }
    return
  }

  const shaPassword = shajs('sha256')
    .update(password)
    .digest('hex')
  if (shaPassword != userinfo.password) {
    ctx.body = {
      code: 'PASSWORD_INVALID',
      message: '密码错误'
    }
    return
  }

  ctx.body = {
    code: 0,
    data: userinfo
  }
}

exports.register = async ctx => {
  const params = ctx.request.body
  params.password = shajs('sha256')
    .update(params.password)
    .digest('hex')
  try {
    const userinfo = await createUser(params)
    ctx.body = {
      code: 0,
      data: userinfo
    }
  } catch (error) {
    if (error.message.includes('E11000 duplicate key')) {
      ctx.body = {
        code: 'USER_HAS_EXISTED',
        message: '用户名已经被注册'
      }
    } else {
      throw error
    }
  }
}
