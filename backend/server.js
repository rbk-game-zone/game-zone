require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketHandler = require("./socket");
const db = require("./model");
const bcrypt = require('bcrypt');
const app = express();
const server = http.createServer(app);
const jwt = require('jsonwebtoken');
const userRoute = require('./router/user.router');
const gameRoute = require('./routes/gameRoutes');
const path = require('path');

const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Import Routes
const chatRoutes = require("./routes/chat.routes");
app.use("/api/chat", chatRoutes);
app.use('/api/user', userRoute);
app.use('/api', gameRoute);

// Serve files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Also serve files from the uploads directory if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle WebSockets
socketHandler(io);

const PORT = process.env.PORT || 8000;

// Sync database and start server
db.sequelize.sync().then(() => {
  console.log("Database synchronized");
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
