// backend/routes/gameRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const JSZip = require('jszip');
const db = require('../model'); // Import the database model
const { createGame, getAllGames, unzipAndRunGame, submitScore } = require('../controllers/game.controller'); // Import the controller
const { createGame, getAllGames, unzipAndRunGame, getGamesByCategory, getCategories, addCategory     } = require('../controllers/game.controller'); // Import the controller
const router = express.Router();

// Use memory storage to handle file uploads
const storage = multer.memoryStorage(); 
const upload = multer({ storage });
router.post('/submit', submitScore);

router.post('/upload', upload.fields([{ name: 'gameFile' }, { name: 'thumbnail' }]), createGame); // Use the controller
router.get("/", getAllGames); // Route to get all games
router.post('/unzip/:id', unzipAndRunGame); // Ensure this route is defined for unzipping and running the game
router.get('/category/:category', getGamesByCategory); // Route to get games by category
router.get('/categories', getCategories); // Route to get all categories
router.post('/categories', addCategory); // Route to add a category
module.exports = router;