const next = require('next')
const Koa = require('koa')
const app = new Koa()
const server = require('http').createServer(app.callback())
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const MongooseStore = require('koa-session-mongoose')

const logger = require('./middlewares/logger')
const config = require('../config')

const port = process.env.PORT || 8090
const dev = process.env.NODE_ENV != 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()
const dispatchRouter = require('./router')
const connectMongo = require('./mongoose')

require('../assets/js/create-socket-server')(server)

app.config = config
nextApp.prepare().then(() => {
  const router = new Router()
  app.use(logger())
  app.keys = ['test']
  app.use(
    session(
      {
        store: new MongooseStore({
          expirationTime: 5 * 60
        })
      },
      app
    )
  )
  app.use(bodyParser())

  dispatchRouter(router)

  router.all('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  app.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  app.use(router.routes())

  app.on('error', (error, ctx) => {
    ctx.logger.info(error)
    // TODO: use sentry to collect error info
  })

  server.listen(port, () => {
    logger.info('> Ready on http://localhost:' + port)
  })
  connectMongo()
})
