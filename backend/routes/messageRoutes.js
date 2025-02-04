const express = require('express');
const router = express.Router();
const messageController = require('../controller/messageController');

// Send a message
router.post('/', messageController.sendMessage);

// Get messages for a specific room
router.get('/:roomId', messageController.getMessages);

module.exports = router; 