const getLogger = require('../../assets/js/log')
const log4jsLogger = getLogger()
const ms = require('pretty-ms')

function logger() {
  return async (ctx, next) => {
    ctx.logger = log4jsLogger

    const start = Date.now()
    await next()
    const time = ms(Date.now() - start)
    log4jsLogger.info(
      `${ctx.method}/${ctx.status} ${ctx.url} - ${time}: ${JSON.stringify(
        ctx.body || ''
      )}`
    )
  }
}
;['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach(method => {
  logger[method] = log4jsLogger[method].bind(log4jsLogger)
})

module.exports = logger
