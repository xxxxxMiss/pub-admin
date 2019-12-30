import axios from 'axios'
import { message, notification } from 'antd'

const isServer = typeof window === 'undefined'

const instance = axios.create({
  baseURL: isServer ? 'http://127.0.0.1:8090/' : ''
})

instance.interceptors.response.use(
  res => {
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
      notification.error({
        message: 'Request Error',
        description: error.message,
        duration: null
      })
    }
  }
)

export const get = instance.get
export const post = instance.post
