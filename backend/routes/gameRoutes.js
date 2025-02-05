// backend/routes/gameRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../model'); // Import the database model
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/games/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

router.post('/upload', upload.single('gameFile'), async (req, res) => {
    try {
        const { title, description } = req.body; // Get title and description from the request body
        const gameFilePath = `public/games/${req.file.originalname}`; // Path to the uploaded file

        // Save game information in the database
        const newGame = await db.Game.create({
            title,
            description,
            game_file: gameFilePath,
            thumbnail: req.body.thumbnail // Assuming thumbnail is also sent
        });

        res.status(200).json({ message: 'Game uploaded successfully', game: newGame });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload game' });
    }
});

module.exports = router;