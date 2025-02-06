import React, { useEffect, useState } from "react";
import io from "socket.io-client";



const socket = io("http://localhost:8000"); // Adjust the URL if needed

const Chat: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<{ userId: string; content: string }[]>([]);
  const [roomName, setRoomName] = useState<string>("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (roomId) {
      socket.emit("joinRoom", { user_id: user.id, room_id: roomId });
    }

    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [roomId]);

  const joinRoom = () => {
    if (roomId.trim() !== "") {
      socket.emit("joinRoom", { user_id: user.id, room_id: roomId });
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("sendMessage", { room_id: roomId, user_id: user.id, content: message });
      setMessage("");
    }
  };

  const createRoom = () => {
    if (roomName.trim() !== "") {
      socket.emit("createRoom", roomName);
      setRoomName("");
    }
  };

  return (
    <div className="container chat-container">
      <h2 className="text-center mb-4">Real-Time Chat</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button className="btn btn-primary mt-2 w-100" onClick={createRoom}>
          Create Room
        </button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button className="btn btn-primary mt-2 w-100" onClick={joinRoom}>
          Join Room
        </button>
      </div>

      <div className="chat-box p-3 border rounded mb-3">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.userId === user.id ? "own-message" : ""}`}>
            <strong>{msg.userId}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
