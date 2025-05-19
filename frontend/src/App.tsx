import { useState } from 'react'
import './App.css'
import Form from './components/form'
import Chat from './components/chat'
import type { Message } from './types/message'

function App() {
  const [room, setRoom] = useState<string | null>(null)
  const [name, setName] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])

  return (
    <>
      { room ? (
        <Form setRoom={setRoom} setName={setName} />
      ) : (
        <Chat />
      )}
    </>
  )
}

export default App
