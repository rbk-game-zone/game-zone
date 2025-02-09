import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io, { Socket } from "socket.io-client";
import { FaComments } from "react-icons/fa";
import { timeAgo } from "../utils/timeUtils";
import LoadingAnimation from "./LoadingAnimation"; // Import the loading animation
import {Game} from "../types/tables/game"
import {Room} from "../types/tables/room"
import {Message} from "../types/tables/message"
import { User } from "../types/tables/user"

import VoiceChat from './VoiceChat';




const socket: Socket = io(import.meta.env.VITE_API_URL); // Use the dynamic API URL from environment variables

const Home: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [filteredGames, setFilteredGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);
    const [messageContent, setMessageContent] = useState<string>("");
    const [roomName, setRoomName] = useState<string>("");
    const [isChatVisible, setIsChatVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading animation
    const user: User = JSON.parse(localStorage.getItem("user") || "{}");
    const [isVoiceChatVisible, setIsVoiceChatVisible] = useState(false);
    const notificationSound = new Audio('/notification-7-270142.mp3'); // Ensure this path is correct
    const messagesEndRef = useRef(null);
    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get<Game[]>(`${import.meta.env.VITE_API_URL}/api/`);
                setGames(response.data);
                setFilteredGames(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load games. Please try again later.");
                setLoading(false);
            }
        };
        fetchGames();
        const fetchRooms = async () => {
            const response = await axios.get(`${API_URL}/api/chat/rooms`);
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

    useEffect(() => {
        if (searchQuery) {
            const filtered = games.filter(game => game.title.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredGames(filtered);
        } else {
            setFilteredGames(games);
        }
    }, [searchQuery, games]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                // If the user switches tabs or minimizes the browser, stop the loading animation
                setIsLoading(false);
            }
        };

        // Add event listener for visibility change
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const handleGameClick = async (gameId: string) => {
        setIsLoading(true); // Show loading animation

        let timeoutId;

        try {
           
            // Unzip the game (this will happen after the delay)
            await axios.post(`${import.meta.env.VITE_API_URL}/api/unzip/${gameId}`);
        } catch (err) {
            alert("Failed to start the game. Please try again later.");
            setIsLoading(false); // Hide loading animation if there's an error
        } finally {
            // Clear the timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            setIsLoading(false); // Ensure the loading animation is hidden once done
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
            console.error("Useruser.user ID is not defined.");
        }
    };

    const fetchMessages = async (roomId: string) => {
        const response = await axios.get<Message[]>(`${import.meta.env.VITE_API_URL}/api/chat/rooms/${roomId}/messages`);
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
            {isLoading && <LoadingAnimation />} {/* Show loading animation when isLoading is true */}

            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsChatVisible(!isChatVisible)}
                className="btn btn-primary chat-toggle-btn"
                style={{ backgroundColor: "olive" }}
            >
                <FaComments size={24} /> {isChatVisible ? "Close Chat" : "Chat"}
            </button>

            {!isChatVisible && (
                <>
                    <h1 id="gamelobby" className="text-center mb-4">Game Lobby</h1>
                    <div className="mb-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search games..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </>
            )}

            {!isChatVisible && (
                <>
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : (
                        <div className="row">
                            {filteredGames.map((game) => (
                                <div key={game.id} className="col-md-4 mb-4">
                                    <div className="card h-100 shadow-sm" onClick={() => handleGameClick(game.id)}>
                                        <img src={game.thumbnail} className="card-img-top game-thumbnail" alt={game.title} />
                                        <div className="card-body">
                                            <h5 className="card-title">{game.title}</h5>
                                            <div className="card-description">
                                                <p>{game.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Chat Section */}
            <div className="chat-section mt-5">
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
                                <h2 className="chat-messages-header">{`Messages`}</h2>
                                <div className="chat-box p-3 border rounded" style={{ height: "300px", overflowY: "scroll", backgroundColor: "gray" }}>
                                    {messages.map((msg) => (
                                        <div 
                                            key={msg.id} 
                                            className="chat-message mb-2" 
                                            style={{ backgroundColor: msg.user_id === user.id ? 'lightblue' : 'transparent', padding: '5px', borderRadius: '5px' }}
                                        >
                                            <strong>
                                                {msg.user_id === user.id ? user.username : `Player ${msg.user_id} `} :
                                                {` ${msg.content}`}
                                            </strong>
                                            <div>
                                                <span className="text-muted small chat-timestamp">{timeAgo(new Date(msg.createdAt))}</span>
                                            </div>
                                            <div></div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="chat-input-container mt-3">
                                    <input
                                        type="text"
                                        className="form-control chat-input"
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                sendMessage(); // Call sendMessage when Enter is pressed
                                            }
                                        }}
                                        placeholder="Type a message..."
                                    />
                                    <button className="btn btn-primary mt-2 chat-send-btn" onClick={sendMessage}>Send</button>
                                    
                                </div>
                                <button onClick={() => setIsVoiceChatVisible(!isVoiceChatVisible)}>
                            {isVoiceChatVisible ? "Stop Voice Chat" : "Start Voice Chat"}
                        </button>
                        <VoiceChat roomId={currentRoom} />

                            </div>
                            
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;