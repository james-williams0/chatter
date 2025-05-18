from fastapi import FastAPI
import uuid
from uuid import UUID

class Message:
    def __init__(self, sender: str, content: str):
        self.sender: str = sender
        self.content: str = content

class Room:
    def __init__(self, room_id: UUID):
        self.room_id: UUID = room_id
        self.messages: list[Message] = []

    def add_message(self, message: Message):
        self.messages.append(message)

    def get_messages(self):
        return self.messages


rooms: dict[str, Room] = {}

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/create-room")
async def create_room():
    room_id = uuid.uuid4()
    rooms[room_id] = Room(room_id)
    return {"message": "Room created"}