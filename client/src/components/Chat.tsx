import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000"); // Adjust the URL if needed

const Chat: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [userId, setUserId] = useState<string>(""); // Replace with actual user ID logic
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<{ userId: string; content: string }[]>([]);
  const [roomName, setRoomName] = useState<string>("");
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log("usersssss",user.id);
  // Handle receiving messages
  useEffect(() => {
    // Join the room when the component mounts
    if (roomId) {
      socket.emit("joinRoom", { user_id: user.id, room_id: roomId });
    }

    // Listen for new messages
    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [roomId, userId]);

  // Join a room
  const joinRoom = () => {
    if (roomId.trim() !== "") {
      socket.emit("joinRoom", { user_id: user.id, room_id: roomId });
    }
  };

  // Send a message
  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("sendMessage", { room_id: roomId, user_id: user.id, content: message });
      setMessage(""); // Clear input after sending
    }
  };

  // Create a room
  const createRoom = () => {
    if (roomName.trim() !== "") {
      socket.emit("createRoom", roomName);
      setRoomName(""); // Clear input after creating
    }
  };

  return (
    <div className="chat-container">
      <h2>Real-Time Chat</h2>

      <div>
        <input
          type="text"
          placeholder="Enter Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button onClick={createRoom}>Create Room</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>

      {/* <div>
        <input
          type="text"
          placeholder="Your User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div> */}

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.userId}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
