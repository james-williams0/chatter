import React, { useEffect, useRef, useState } from 'react'
import type { Message } from '../types/message'

interface ChatProps {
    room: string
    identity: string
    messages: Message[]
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

const Chat: React.FC<ChatProps> = ({ room, identity, messages, setMessages }) => {
    const [input, setInput] = useState<string>('')
    const websocket = useRef<WebSocket | null>(null)
    
    useEffect(() => {
        websocket.current = new WebSocket(`/ws/${room}/`);
        websocket.current.onmessage = (event) => {
            const message = JSON.parse(event.data) as Message;
            setMessages(prevMessages => [...prevMessages, message]);
        }
        return () => {
            websocket.current?.close();
        }
    }, [room])

    const send = (e: React.FormEvent) => {
        e.preventDefault()
        if (websocket.current) {
            websocket.current.send(JSON.stringify({ sender: identity, content: input }))
            setMessages(prevMessages => [...prevMessages, { sender: identity, content: input }])
            setInput('')
        }
    }

    return (
        <>
            <h1>Room: {room}</h1>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>
                        <strong>{message.sender}</strong>: {message.content}
                    </div>
                ))}
            </div>
            <form onSubmit={send}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Aa"
                />
                <button type="submit">Send</button>
            </form>
        </>
    )
}

export { Chat }
