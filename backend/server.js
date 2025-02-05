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
app.use('/api/games', gameRoute);
// Handle WebSockets
socketHandler(io);

const PORT = process.env.PORT || 5000;

// Sync database and start server
db.sequelize.sync().then(() => {
  console.log("Database synchronized");
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
