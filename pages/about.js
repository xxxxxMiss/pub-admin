import { useState } from 'react'
import Link from 'next/link'
import request from '@js/request'
import useSocket from '@hooks/useSocket'

export default function About(props) {
  const [field, setField] = useState('')
  const [newMessage, setNewMessage] = useState(0)
  const [messages, setMessages] = useState(props.messages || [])

  const socket = useSocket('message.chat1', message => {
    console.log('----socket----', message)
    setMessages(messages => [...messages, message])
  })

  console.log('000000', props.socket)

  // useSocket('message.chat2', () => {
  // setNewMessage(newMessage => newMessage + 1)
  // })

  const handleSubmit = event => {
    event.preventDefault()

    // create message object
    const message = {
      id: new Date().getTime(),
      value: field
    }

    // send object to WS server
    socket.emit('message.chat1', message)
    setField('')
    setMessages(messages => [...messages, message])
  }

  return (
    <main>
      <div>
        <Link href="/">
          <a>{'Chat One'}</a>
        </Link>
        <br />
        <Link href="/clone">
          <a>
            {`Chat Two${
              newMessage > 0 ? ` ( ${newMessage} new message )` : ''
            }`}
          </a>
        </Link>
        <ul>
          {messages.map(message => (
            <li key={message.id}>{message.value}</li>
          ))}
        </ul>
        <form onSubmit={e => handleSubmit(e)}>
          <input
            onChange={e => setField(e.target.value)}
            type="text"
            placeholder="Hello world!"
            value={field}
          />
          <button>Send</button>
        </form>
      </div>
    </main>
  )
}

About.getInitialProps = async ctx => {
  const messages = await request(ctx).get('/api/messages/chat1')

  return { messages }
}
