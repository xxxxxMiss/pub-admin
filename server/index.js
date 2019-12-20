const next = require('next')
const Koa = require('koa')
const Router = require('koa-router')

const userModel = require('../models/user')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV != 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  router.get('/a', async ctx => {
    await app.render(ctx.req, ctx.res, '/a', ctx.query)
    ctx.respond = false
  })

  router.get('/api/login', async ctx => {
    const query = ctx.query
    if (query.name != 'admin') {
      ctx.status = 200
      ctx.body = {
        code: 'USER_INVALID',
        message: '当前用户无权限访问'
      }
    } else {
      userModel.create(query)
      ctx.status = 200
      ctx.body = {
        code: 0
      }
    }
  })

  router.all('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.use(router.routes())
  server.listen(port, () => {
    console.log('> Ready on http://localhost: ' + port)
  })
})
