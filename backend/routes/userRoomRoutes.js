const express = require('express');
const router = express.Router();
const userRoomController = require('../controller/userRoomController');

// Add a user to a room
router.post('/add', userRoomController.addUserToRoom);

// Remove a user from a room
router.delete('/remove', userRoomController.removeUserFromRoom);

module.exports = router; 