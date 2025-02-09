import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { FaComments } from "react-icons/fa";
import { timeAgo } from "../utils/timeUtils";
import "./Chat.css";
import VoiceChat from './VoiceChat';
import Score from "../../../public/games/snake/score/score"
import { useGameContext } from '../context/GameContext';
import ErrorBoundary from './ErrorBoundary'; // Import the ErrorBoundary component

const socket = io("http://localhost:8000");

const home = () => {
    const { id } = useParams();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [hoveredGameId, setHoveredGameId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [messageContent, setMessageContent] = useState("");
    const [roomName, setRoomName] = useState("");
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [isVoiceChatVisible, setIsVoiceChatVisible] = useState(false);
    const messagesEndRef = useRef(null);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const { setGameId } = useGameContext();

    // Load notification sound
    const notificationSound = new Audio('/notification-7-270142.mp3'); // Ensure this path is correct

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

        const fetchRooms = async () => {
            const response = await axios.get("http://localhost:8000/api/chat/rooms");
            setRooms(response.data);
        };
        fetchRooms();

        socket.on("newMessage", (message) => {
            setMessages((prev) => [...prev, message]);
            notificationSound.play(); // Play notification sound on new message
        });
        socket.on("roomCreated", (room) => setRooms((prev) => [...prev, room]));

        return () => {
            socket.off("newMessage");
            socket.off("roomCreated");
        };
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleGameClick = async (gameId) => {
        setGameId(gameId); // Set the game ID in context
        try {
            const response = await axios.post(`http://localhost:8000/api/unzip/${gameId}`, {
                user_id: user.id // Send the user ID in the request body
            });
            console.log(response.data.message); // Log the success message
            window.postMessage({
                userId: user.id,
                gameId: gameId
            }, '*'); // Use '*' to allow all origins or specify the target origin
        } catch (error) {
            console.error('Error starting the game:', error);
        }
    };

    const createRoom = () => {
        socket.emit("createRoom", { name: roomName, created_by: user.id });
        setRoomName("");
    };

    const joinRoom = (roomId) => {
        if (user.id) {
            socket.emit("joinRoom", { user_id: user.id, room_id: roomId });
            setCurrentRoom(roomId);
            setMessages([]);
            fetchMessages(roomId);
            setIsChatVisible(true);
        } else {
            console.error("User ID is not defined.");
        }
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
        <div className="game-chat-container">
            <div className="game-section">
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    <div className="game-container">
                        {games.map((game) => (
                            <div 
                                key={game.id} 
                                className="game-card" 
                                onClick={() => handleGameClick(game.id)}
                                onMouseEnter={() => setHoveredGameId(game.id)}
                                onMouseLeave={() => setHoveredGameId(null)}
                                style={{ position: 'relative' }}
                            >
                                <img src={game.thumbnail} alt={game.title} style={{ width: "300px" }} />
                                <h3>{game.title}</h3>
                                {hoveredGameId === game.id && (
                                    <div 
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'rgba(147, 145, 145, 0.8)',
                                            color: 'white',
                                            padding: '2px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textAlign: 'center',
                                            transition: 'all 0.3s ease',
                                            zIndex: 1
                                        }}
                                    >
                                        <p>{game.description}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="chat-section">
                <button onClick={() => setIsChatVisible(!isChatVisible)} className="chat-icon">
                    <FaComments size={24} />
                </button>
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
                            <h2>Messages in Room: {currentRoom ? rooms.find((room) => room.id === currentRoom)?.name : ""}</h2>
                            <div className="messages">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`message ${msg.User?.id === user.id ? "my-message" : "other-message"}`}>
                                        <div className="message-content">
                                            <strong>{msg.User?.username || user.username}:</strong>
                                            {msg.content}
                                            <span className="timestamp">{timeAgo(new Date(msg.createdAt))}</span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="input-area">
                                <input
                                    type="text"
                                    value={messageContent}
                                    onChange={(e) => setMessageContent(e.target.value)}
                                    placeholder="Type a message..."
                                />
                                <button onClick={sendMessage}>Send</button>
                            </div>
                        </div>
                        <button onClick={() => setIsVoiceChatVisible(!isVoiceChatVisible)}>
                            {isVoiceChatVisible ? "Stop Voice Chat" : "Start Voice Chat"}
                        </button>
                        <ErrorBoundary>
                            <VoiceChat roomId={currentRoom} />
                        </ErrorBoundary>
                    </div>
                )}
            </div>
        </div>
    );
};

export default home;
