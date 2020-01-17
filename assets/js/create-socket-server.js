module.exports = function createSocketServer(httpServer) {
  const io = require('socket.io')(httpServer)
  const buildEvent = require('./socketio-event')
  const logger = require('./log')()

  io.on('connection', socket => {
    let buildInfo = ''
    buildEvent.on('build:info', data => {
      buildInfo += data
    })
    buildEvent.on('build:end', () => {
      socket.emit('build:end')
    })
    socket.on('build:info', () => {
      io.emit('build:info', buildInfo)
    })
    socket.on('error', logger.error.bind(logger))
  })
}
