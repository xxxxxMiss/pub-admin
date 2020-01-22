const { createUser, getUserByName, getUserById } = require('../service/user')
const { getApplicationById } = require('../service/application')
const shajs = require('sha.js')
const { userJoiSchema } = require('~js/validation')

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

  ctx.session.user = userinfo

  ctx.body = {
    code: 0,
    data: userinfo
  }
}

exports.logout = async ctx => {
  ctx.session.user = null
  ctx.body = {
    code: 0
  }
}

exports.register = async ctx => {
  const params = ctx.request.body
  Reflect.deleteProperty(params, 'repeat_password')
  const { error } = userJoiSchema.validate(params)
  if (error) {
    ctx.status = 400
    ctx.message = error.message
    return
  }
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

exports.collectApplication = async ctx => {
  const user = ctx.session.user
  let userDoc = await getUserByName(user.name)

  let collections = userDoc.collectAppications
  const appid = ctx.request.body.appid

  // mongoose `_id` is a instance of mongodb.ObjectID
  for (let i = 0; i < collections.length; i++) {
    const aid = collections[i]
    if (aid.toString() === appid) {
      collections.splice(i, 1)
      await userDoc.save()
      const app = await getApplicationById(aid)
      if (app) {
        const userids = app.collectedByUsers
        for (let j = 0; j < userids.length; ++j) {
          if (userids[j].toString() === user._id.toString()) {
            userids.splice(j, 1)
            await app.save()
            break
          }
        }
      }
      ctx.body = {
        code: 0,
        data: {
          isCollected: false
        },
        message: '取消收藏'
      }
      return
    }
  }
  collections.push(appid)
  await userDoc.save()
  const app = await getApplicationById(appid)
  if (app) {
    app.collectedByUsers.push(user._id)
    await app.save()
  }
  ctx.body = {
    code: 0,
    data: {
      isCollected: true
    },
    message: '收藏成功'
  }
}

exports.getUserInfo = async ctx => {
  // const userinfo = await getUserById(ctx.session.user._id)
  // TODO: filter filed
  ctx.body = {
    code: 0,
    data: ctx.session.user
  }
}
