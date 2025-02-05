require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketHandler = require("./socket");
const db = require("./model");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const chatRoutes = require("./routes/chat.routes");
app.use("/api/chat", chatRoutes);

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
