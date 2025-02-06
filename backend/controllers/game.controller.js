const { Game } = require('../model/index');
const path = require('path');
const fs = require('fs');
const JSZip = require('jszip');

module.exports = {
    createGame: async (req, res) => {
        try {
            console.log('Files:', req.files); // Debug log
            console.log('Body:', req.body);   // Debug log

            if (!req.files || !req.files.gameFile) {
                return res.status(400).json({ message: 'Missing required files' });
            }

            const gameFile = req.files.gameFile[0];
            const gameDir = path.join(__dirname, '../../uploads/games', Date.now().toString());
            const zipFilePath = path.join(gameDir, gameFile.originalname);

            // Create game directory
            if (!fs.existsSync(gameDir)) {
                fs.mkdirSync(gameDir, { recursive: true });
            }

            // Save the zip file
            fs.writeFileSync(zipFilePath, gameFile.buffer);

            // Unzip the file
            const zip = new JSZip();
            const zipData = fs.readFileSync(zipFilePath);
            const unzipped = await zip.loadAsync(zipData);

            // Extract all files
            for (const [relativePath, file] of Object.entries(unzipped.files)) {
                if (!file.dir) {
                    const filePath = path.join(gameDir, relativePath);
                    const dir = path.dirname(filePath);

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }

                    fs.writeFileSync(filePath, await file.async('nodebuffer'));
                }
            }

            // Save game data in the database
            const game = await Game.create({
                title: req.body.title,
                description: req.body.description,
                game_file: gameDir, // Store the directory path
                thumbnail: req.files.thumbnail ? `/uploads/${req.files.thumbnail[0].filename}` : null
            });

            res.status(201).json(game);
        } catch (error) {
            console.error('Error creating game:', error);
            res.status(500).json({ message: "Error creating game", error: error.message });
        }
    }
};