const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");

// Create a new room
router.post("/rooms", chatController.createRoom);

// Join a room
router.post("/rooms/join", chatController.joinRoom);

// Get all rooms
router.get("/rooms", chatController.getRooms);

// Get messages by room ID
router.get("/rooms/:room_id/messages", chatController.getMessagesByRoom);

module.exports = router;
