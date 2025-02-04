const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const messageRoutes = require('./routes/messageRoutes');
const roomRoutes = require('./routes/roomRoutes');
const userRoomRoutes = require('./routes/userRoomRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.io with the server

// Middleware
app.use(bodyParser.json());

// Pass the io instance to the routes
app.use((req, res, next) => {
    req.io = io; // Attach the io instance to the request object
    next();
});

// Define your routes
app.use('/api/messages', messageRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/user-rooms', userRoomRoutes);

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle events here, e.g., joining a room
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 