// backend/routes/gameRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const JSZip = require('jszip');
const db = require('../model'); // Import the database model
const { createGame, getAllGames, unzipAndRunGame } = require('../controllers/game.controller'); // Import the controller
const router = express.Router();

// Use memory storage to handle file uploads
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

router.post('/upload', upload.fields([{ name: 'gameFile' }, { name: 'thumbnail' }]), createGame); // Use the controller
router.get("/", getAllGames); // Route to get all games
router.post('/unzip/:id', unzipAndRunGame); // Ensure this route is defined for unzipping and running the game

module.exports = router;