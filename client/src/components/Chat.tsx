import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { timeAgo } from "../utils/timeUtils"; // Import the time utility
import './Chat.css'; // Import the CSS file for styling
import { FaComments } from 'react-icons/fa'; // Import chat icon from react-icons

const socket = io("http://localhost:8000"); // Adjust the URL as needed

const Chat = () => {
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Create a ref for the messages container

  useEffect(() => {
    // Fetch rooms on component mount
    const fetchRooms = async () => {
      const response = await axios.get("http://localhost:8000/api/chat/rooms");
      setRooms(response.data);
    };

    fetchRooms();

    // Listen for new messages
    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for room creation
    socket.on("roomCreated", (room) => {
      setRooms((prevRooms) => [...prevRooms, room]);
    });

    return () => {
      socket.off("newMessage");
      socket.off("roomCreated");
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the messages when new messages are added
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Run this effect whenever messages change

  const createRoom = () => {
    socket.emit("createRoom", { name: roomName, created_by: user.id });
    setRoomName("");
  };

  const joinRoom = (roomId) => {
    setCurrentRoom(roomId);
    setMessages([]); // Clear messages when switching rooms
    socket.emit("joinRoom", { user_id: user.id, room_id: roomId });
    fetchMessages(roomId);
    setIsChatVisible(true); // Show chat when joining a room
  };

  const fetchMessages = async (roomId) => {
    const response = await axios.get(`http://localhost:8000/api/chat/rooms/${roomId}/messages`);
    setMessages(response.data);
  };

  const sendMessage = () => {
    if (messageContent.trim() && currentRoom) {
      socket.emit("sendMessage", { user_id: user.id, room_id: currentRoom, content: messageContent });
      setMessageContent("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage(); // Call sendMessage when Enter is pressed
    }
  };

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className="chat-app">
      <div className="navbar">
        <h1>My Chat App</h1>
        <button onClick={toggleChatVisibility} className="chat-icon">
          <FaComments size={24} />
        </button>
      </div>
      {isChatVisible && (
        <div className="chat-container">
          <div className="room-list">
            <h2>Rooms</h2>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Room Name"
            />
            <button onClick={createRoom}>Create Room</button>
            <ul>
              {rooms.map((room) => (
                <li key={room.id} onClick={() => joinRoom(room.id)}>
                  {room.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="message-area">
            <h2>Messages in Room: {currentRoom ? rooms.find(room => room.id === currentRoom)?.name : ''}</h2>
            <div className="messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.User?.id === user.id ? 'my-message' : 'other-message'}`}>
                  <div className="message-content">
                    <strong>{msg.User?.username || user.username}:</strong>
                    {msg.content}
                    <span className="timestamp">{timeAgo(new Date(msg.createdAt))}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* This div will be used to scroll to the bottom */}
            </div>
            <div className="input-area">
              <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyDown={handleKeyDown} // Add onKeyDown event
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
