import { useEffect } from 'react'
import io from 'socket.io-client'

const socket = io({
  reconnectionAttempts: 10
})

export default function useSocket(eventName, cb) {
  useEffect(() => {
    console.log('---socket effect')
    socket.on(eventName, cb)

    return function useSocketCleanup() {
      console.log('---socket clean')
      socket.off(eventName, cb)
    }
  }, [eventName, cb])

  return socket
}
