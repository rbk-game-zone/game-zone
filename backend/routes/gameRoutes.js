// backend/routes/gameRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../model'); // Import the database model
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../public/games'); // Ensure this path is correct
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
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

// Add this route to get a single game
router.get('/games/:id', async (req, res) => {
    try {
        const game = await db.Game.findByPk(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(game);
    } catch (error) {
        console.error('Error fetching game:', error);
        res.status(500).json({ message: 'Error fetching game', error: error.message });
    }
});

module.exports = router;