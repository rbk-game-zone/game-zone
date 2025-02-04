import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3000'); // Adjust the URL if your server is hosted elsewhere

function App() {
  const [rooms, setRooms] = useState<string[]>([]);
  const [messages, setMessages] = useState<{ roomId: string; content: string }[]>([]);
  const [newRoom, setNewRoom] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  useEffect(() => {
    socket.on('roomCreated', (room: string) => {
      setRooms((prev) => [...prev, room]);
    });

    socket.on('newMessage', (message: { roomId: string; content: string }) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('roomCreated');
      socket.off('newMessage');
    };
  }, []);

  const createRoom = () => {
    if (newRoom) {
      socket.emit('createRoom', newRoom);
      setNewRoom('');
    }
  };

  const sendMessage = () => {
    if (newMessage && currentRoom) {
      socket.emit('chat message', { roomId: currentRoom, content: newMessage });
      setNewMessage('');
    }
  };

  const joinRoom = (room: string) => {
    setCurrentRoom(room);
    setMessages([]); // Clear messages when switching rooms
    socket.emit('joinRoom', room);
  };

  return (
    <div className="App">
      <h1>Socket.IO Chat</h1>
      <div>
        <input
          type="text"
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
          placeholder="New Room Name"
        />
        <button onClick={createRoom}>Create Room</button>
      </div>
      <div>
        <h2>Rooms</h2>
        <ul>
          {rooms.map((room) => (
            <li key={room} onClick={() => joinRoom(room)}>
              {room}
            </li>
          ))}
        </ul>
      </div>
      {currentRoom && (
        <div>
          <h2>Messages in {currentRoom}</h2>
          <ul>
            {messages
              .filter((msg) => msg.roomId === currentRoom)
              .map((msg, index) => (
                <li key={index}>{msg.content}</li>
              ))}
          </ul>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
