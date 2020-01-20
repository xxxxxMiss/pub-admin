const axios = require('axios')
const Router = require('next/router')
const { message } = require('antd')

const isServer = typeof window === 'undefined'

function isomorphicRequest(ctx, options = {}) {
  const logger = isServer ? ctx.logger : console
  const config = {
    baseURL: '',
    headers: {},
    validateStatus: status => status == 200
  }
  if (isServer && ctx && ctx.req) {
    config.baseURL = options.baseURL || 'http://127.0.0.1:8090/'
    config.headers.Cookie = ctx.req.headers.cookie || ''
  }
  const instance = axios.create(config)

  instance.interceptors.response.use(
    res => {
      // the third api: eg. gitlab
      if (options.baseURL) {
        return res.data
      }
      const { code, data = {}, message: msg } = res.data
      if (code == 0) {
        return data
      }
      if (!isServer) {
        message.error(msg)
      }
      return null
    },
    error => {
      if (error.response) {
        if (!isServer) {
          if (error.response.status === 403) {
            Router.push('/user/login')
          } else {
            message.error(error.response.statusText)
          }
        } else if (error.response.status === 403) {
          ctx.res.writeHead(302, { Location: '/user/login' })
          ctx.res.end()
        }
      } else if (error.request) {
        if (!isServer) {
          message.error(error.request)
        } else {
          logger.error(error.request)
        }
      } else {
        logger.error(error)
      }
    }
  )
  return instance
}

module.exports = exports = isomorphicRequest

exports.get = function get(url, config) {
  return isomorphicRequest().get(url, config)
}

exports.post = function post(url, data, config) {
  return isomorphicRequest().post(url, data, config)
}
