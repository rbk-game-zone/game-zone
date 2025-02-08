import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { FaComments } from "react-icons/fa";
import { timeAgo } from "../utils/timeUtils";

const socket = io("http://localhost:8000");

const Home = () => {
    const { id } = useParams();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [messageContent, setMessageContent] = useState("");
    const [roomName, setRoomName] = useState("");
    const [isChatVisible, setIsChatVisible] = useState(false);
    const messagesEndRef = useRef(null);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/");
                setGames(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load games. Please try again later.");
                setLoading(false);
            }
        };
        fetchGames();

        socket.on("newMessage", (message) => setMessages((prev) => [...prev, message]));
        socket.on("roomCreated", (room) => setRooms((prev) => [...prev, room]));

        return () => {
            socket.off("newMessage");
            socket.off("roomCreated");
        };
    }, []);

    const handleGameClick = async (gameId) => {
        try {
            await axios.post(`http://localhost:8000/api/unzip/${gameId}`);
        } catch (err) {
            alert("Failed to start the game. Please try again later.");
        }
    };

    const createRoom = () => {
        socket.emit("createRoom", { name: roomName, created_by: user.id });
        setRoomName("");
    };

    const joinRoom = (roomId) => {
        setCurrentRoom(roomId);
        setMessages([]);
        socket.emit("joinRoom", { user_id: user.id, room_id: roomId });
        fetchMessages(roomId);
        setIsChatVisible(true);
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

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Game Lobby</h1>
            {!isChatVisible && (
                <>
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : (
                        <div className="row">
                            {games.map((game) => (
                                <div key={game.id} className="col-md-4 mb-4">
                                    <div className="card h-100 shadow-sm" onClick={() => handleGameClick(game.id)}>
                                        <img src={game.thumbnail} className="card-img-top" alt={game.title} />
                                        <div className="card-body">
                                            <h5 className="card-title">{game.title}</h5>
                                            <p className="card-text">{game.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            <div className="chat-section mt-5">
                <button onClick={() => setIsChatVisible(!isChatVisible)} className="btn btn-primary chat-toggle-btn">
                    <FaComments size={24} /> {isChatVisible ? "Close Chat" : "Chat"}
                </button>
                {isChatVisible && (
                    <div className="chat-container card mt-3 p-3">
                        <h2 className="chat-header">Chat Rooms</h2>
                        <div className="chat-room-input mb-3">
                            <input
                                type="text"
                                className="form-control chat-room-name"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                placeholder="Room Name"
                            />
                            <button className="btn btn-success mt-2 chat-create-btn" onClick={createRoom}>Create Room</button>
                        </div>
                        <select className="form-select chat-room-select mb-3" onChange={(e) => joinRoom(e.target.value)}>
                            <option value="">Select a Room</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>{room.name}</option>
                            ))}
                        </select>
                        {currentRoom && (
                            <div className="chat-messages-container mt-4">
                                <h2 className="chat-messages-header">Messages</h2>
                                <div className="chat-box p-3 border rounded" style={{ height: "300px", overflowY: "scroll" }}>
                                    {messages.map((msg) => (
                                        <div key={msg.id} className="chat-message mb-2">
                                            <strong>{msg.User?.username || user.username}:</strong> {msg.content}
                                            <span className="text-muted small ms-2 chat-timestamp">{timeAgo(new Date(msg.createdAt))}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="chat-input-container mt-3">
                                    <input
                                        type="text"
                                        className="form-control chat-input"
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        placeholder="Type a message..."
                                    />
                                    <button className="btn btn-primary mt-2 chat-send-btn" onClick={sendMessage}>Send</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
