import { useState } from "react"
import type { Message } from "../types/message"

const useChat = () => {
    const [room, setRoom] = useState<string | null>(null)
    const [identity, setIdentity] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])

    return {
        room,
        setRoom,
        identity,
        setIdentity,
        messages,
        setMessages,
    }
}

export { useChat }
