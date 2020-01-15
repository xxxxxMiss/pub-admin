const next = require('next')
const Koa = require('koa')
const app = new Koa()
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const MongooseStore = require('koa-session-mongoose')
const child_process = require('child_process')

const logger = require('../assets/js/log')()

const port = process.env.PORT || 8090
const dev = process.env.NODE_ENV != 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()
const dispatchRouter = require('./router')
const connectMongo = require('./mongoose')

// fake DB
const messages = {
  chat1: [],
  chat2: []
}

let child_data = ''
const cp = child_process.spawn('yarn', ['install'])
cp.stdout.on('data', d => {
  child_data += d
  console.log('---data---', child_data)
})

cp.on('close', code => {
  console.log(`child_process exit: ${code}`)
})

// socket.io server
io.on('connection', socket => {
  socket.on('message.chat1', data => {
    console.log('----chat1----', data)
    messages['chat1'].push(data)
    // socket.broadcast.emit('message.chat1', data)
    io.emit('message.chat1', child_data)
  })
  socket.on('message.chat2', data => {
    console.log('----chat2----', data)
    messages['chat2'].push(data)
    socket.broadcast.emit('message.chat2', data)
  })
})

nextApp.prepare().then(() => {
  const router = new Router()
  if (dev) {
    app.use(require('koa-logger')())
  }
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

  router.get('/api/messages/:chat', ctx => {
    ctx.body = {
      messages: messages[ctx.params.chat]
    }
  })
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

  app.on('error', error => {
    logger.info(error)
    // TODO: use sentry to collect error info
  })

  server.listen(port, () => {
    logger.info('> Ready on http://localhost:' + port)
  })
  connectMongo()
})
