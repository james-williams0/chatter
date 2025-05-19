import type { Message } from "../types/message"

interface FormProps {
    setRoom: (room: string) => void
    setName: (name: string) => void
    setMessages: (messages: Message[]) => void
}

function Form({ setRoom, setName, setMessages }: FormProps) {
    async function join(formData: FormData) {
        const roomId = formData.get('room') as string
        const name = formData.get('name') as string
        try {
            const response = await fetch(`/api/get-messages/${roomId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                console.warn('Failed to join room:', response.statusText)
                return
            }

            setRoom(roomId)
            setName(name)
            setMessages(await response.json() as Message[])
        }
        catch (error) {
            console.error('Error joining room:', error)
        }
    }

    async function create(formData: FormData) {
        const name = formData.get('name') as string
        try {
            const response = await fetch('/api/create-room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                console.warn('Failed to create room:', response.statusText)
                return
            }

            const data = await response.json()
            setRoom(data.room)
            setName(name)
        }
        catch (error) {
            console.error('Error creating room:', error)
        }
    }

    return (
        <div className="join">
            <h1>Join a Room</h1>
            <form>
                <label htmlFor="room">Room ID:</label>
                <input type="text" id="name" name="name" placeholder="Your Identity" required />
                <input type="text" id="room" name="room" required />
                <button formAction={join}>Join</button>
                <button formAction={create}>Create</button>
            </form>
        </div>
    )
}

export default Form
