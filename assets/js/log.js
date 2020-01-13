const log4js = require('log4js')

log4js.configure({
  appenders: {
    development: {
      type: 'stdout',
      layout: {
        type: 'colored'
        // type: 'pattern',
        // pattern: '%d %p %c %x{user} %m%n'
      }
    },
    production: {
      type: 'file',
      filename: 'pub-admin.log',
      maxLogSize: 10485760,
      compress: true
    }
  },
  categories: {
    default: {
      appenders: ['development'],
      level: 'info'
    },
    production: {
      appenders: ['production'],
      level: 'info'
    }
  }
})

// log4js.shutdown(() => {
//   console.error('Programme exit')
// })

module.exports = function getLogger(category) {
  category = category || process.env.NODE_ENV || 'default'
  return log4js.getLogger(category)
}
