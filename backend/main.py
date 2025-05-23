import uuid
from uuid import UUID
from fastapi import FastAPI, WebSocket, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

class Message:
    def __init__(self, sender: str, content: str):
        self.sender: str = sender
        self.content: str = content


class Room:
    def __init__(self, room_id: UUID):
        self.room_id: UUID = room_id
        self.messages: list[Message] = []
        self.clients: list[WebSocket] = []

    def add_message(self, message: Message):
        self.messages.append(message)

    def get_messages(self):
        return self.messages

    def add_client(self, client: WebSocket):
        self.clients.append(client)

    def remove_client(self, client: WebSocket):
        if client in self.clients:
            self.clients.remove(client)


rooms: dict[UUID, Room] = {}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Hello World"}

@app.post("/create-room/", status_code=status.HTTP_201_CREATED)
async def create_room() -> dict[str, str]:
    room_id: UUID = uuid.uuid4()
    rooms[room_id] = Room(room_id)
    return {"room": str(room_id)}

@app.get("/get-messages/{room_id}", status_code=status.HTTP_200_OK)
async def get_messages(room_id: UUID) -> list[dict[str, str]] | JSONResponse:
    room: Room | None = rooms.get(room_id)
    if room:
        return [vars(message) for message in room.get_messages()]

    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"message": "Room not found"})

@app.websocket("/ws/{room_id}/")
async def websocket_endpoint(new_client: WebSocket, room_id: UUID) -> None:
    await new_client.accept()
    room: Room | None = rooms.get(room_id)
    if not room:
        await new_client.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    room.add_client(new_client)

    try:
        while True:
            data = await new_client.receive_json()
            message = Message(**data)
            room.add_message(message)
            for client in room.clients:
                if client is not new_client:
                    await client.send_json(vars(message))
    except Exception as e:
        print(e)
    finally:
        room.remove_client(new_client)
