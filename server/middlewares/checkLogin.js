module.exports = async (ctx, next) => {
  const user = ctx.session.user
  if (!user) {
    ctx.status = 403
    ctx.body = {
      code: 'USER_NOT_LOGIN',
      message: '用户未登录'
    }
  } else {
    // TODO: middleware is async and await next
    await next()
  }
}
