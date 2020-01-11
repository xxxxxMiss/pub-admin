import axios from 'axios'
import { message, notification } from 'antd'
import Router from 'next/router'

const isServer = typeof window === 'undefined'

// TODO: use commonjs style for universal
export default function isomorphicRequest(ctx, options = {}) {
  const config = {
    baseURL: '',
    headers: {}
  }
  if (isServer && ctx && ctx.req) {
    config.baseURL = options.baseURL || 'http://127.0.0.1:8090/'
    config.headers.Cookie = ctx.req.headers.cookie ?? ''
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
      console.error(error)
      if (!isServer) {
        if (error.response.status === 403) {
          Router.push('/user/login')
        } else {
          notification.error({
            message: 'Request Error',
            description: error.message,
            duration: 5000
          })
        }
      } else if (error?.response?.status === 403) {
        ctx.res.writeHead(302, { Location: '/user/login' })
        ctx.res.end()
      }
    }
  )
  return instance
}

export function get(url, config) {
  return isomorphicRequest().get(url, config)
}

export function post(url, data, config) {
  return isomorphicRequest().post(url, data, config)
}
