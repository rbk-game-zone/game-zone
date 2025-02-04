const express = require('express');
const router = express.Router();
const roomController = require('../controller/roomController');

// Create a new room
router.post('/', roomController.createRoom);

// Get all rooms
router.get('/', roomController.getRooms);

module.exports = router; 