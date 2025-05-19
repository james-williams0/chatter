import "./App.css";
import { Form } from "./components/form";
import { Chat } from "./components/chat";
import { useChat } from "./hooks/useChat";

function App() {
    const { room, setRoom, identity, setIdentity, messages, setMessages } =
        useChat();

    return (
        <>
            {room === null ? (
                <Form
                    setRoom={setRoom}
                    setIdentity={setIdentity}
                    setMessages={setMessages}
                />
            ) : (
                <Chat
                    room={room}
                    identity={identity}
                    messages={messages}
                    setMessages={setMessages}
                />
            )}
        </>
    );
}

export default App;
