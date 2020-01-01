const next = require('next')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const MongooseStore = require('koa-session-mongoose')

const port = process.env.PORT || 8090
const dev = process.env.NODE_ENV != 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const dispatchRouter = require('./router')
const connectMongo = require('./mongoose')

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  server.keys = ['test']
  server.use(
    session(
      {
        store: new MongooseStore()
      },
      server
    )
  )
  server.use(bodyParser())

  dispatchRouter(router)

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
    console.log('> Ready on http://localhost:' + port)
  })
  connectMongo()
})
