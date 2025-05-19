import type { Message } from "../types/message";

interface FormProps {
    setRoom: (room: string) => void;
    setIdentity: (name: string) => void;
    setMessages: (messages: Message[]) => void;
}

const Form: React.FC<FormProps> = ({ setRoom, setIdentity, setMessages }) => {
    async function join(formData: FormData) {
        const roomId = formData.get("room") as string;
        const identity = formData.get("identity") as string;
        try {
            const response = await fetch(`/api/get-messages/${roomId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
''
            if (!response.ok) {
                console.warn("Failed to join room:", response.statusText);
                return;
            }

            setRoom(roomId);
            setIdentity(identity);
            setMessages((await response.json()) as Message[]);
        } catch (error) {
            console.error("Error joining room:", error);
        }
    }

    async function create(formData: FormData) {
        const identity = formData.get("identity") as string;
        try {
            const response = await fetch("/api/create-room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.warn("Failed to create room:", response.statusText);
                return;
            }

            const data = await response.json();
            setRoom(data.room);
            setIdentity(identity);
        } catch (error) {
            console.error("Error creating room:", error);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        if (data.get("room")) {
            join(data);
        } else {
            create(data);
        }
    };

    return (
        <div className="join">
            <h1>Join a Room</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="identity"
                    name="identity"
                    placeholder="Your Identity"
                    required
                />
                <input type="text" id="room" name="room" placeholder="Room ID" />
                <button>Join</button>
                <button>Create</button>
            </form>
        </div>
    );
};

export { Form };
