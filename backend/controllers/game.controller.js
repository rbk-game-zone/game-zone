const { Game } = require('../model/index');
const path = require('path');
const fs = require('fs');
const JSZip = require('jszip');
const { exec } = require('child_process');
const { Category } = require('../model/index');

module.exports = {
    createGame: async (req, res) => {
        try {
            console.log('Files:', req.files); // Debug log
            console.log('Body:', req.body);   // Debug log

            if (!req.files || !req.files.gameFile || req.files.gameFile.length === 0) {
                return res.status(400).json({ message: 'Missing required files' });
            }

            const gameFile = req.files.gameFile[0];
            const gameDir = path.join(__dirname, '../../public/games', req.body.title); // Create a directory named after the game
            const zipFilePath = path.join(gameDir, gameFile.originalname);

            // Create game directory
            if (!fs.existsSync(gameDir)) {
                fs.mkdirSync(gameDir, { recursive: true });
            }

            // Save the zip file
            if (gameFile.buffer) {
                fs.writeFileSync(zipFilePath, gameFile.buffer);
            } else {
                return res.status(400).json({ message: 'File buffer is missing' });
            }

            // Unzip the file
            const zip = new JSZip();
            const zipData = fs.readFileSync(zipFilePath);
            const unzipped = await zip.loadAsync(zipData);

            // Extract all files into the game directory
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
            const category = await Category.findOne({ where: { name: req.body.category } });
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
            // Save game data in the database
            const game = await Game.create({
                title: req.body.title,
                description: req.body.description,
                game_file: gameDir, // Store the directory path
                thumbnail: req.body.thumbnail, // Store the image URL directly from the request body
                category_id: category.id
            });

            res.status(201).json(game);
        } catch (error) {
            console.error('Error creating game:', error);
            res.status(500).json({ message: "Error creating game", error: error.message });
        }
    },
    getAllGames: async (req, res) => {
        try {
            const games = await Game.findAll();
            res.status(200).json(games);
        } catch (error) {
            console.error('Error fetching games:', error);
            res.status(500).json({ message: "Error fetching games", error: error.message });
        }
    },
    getGameById: async (req, res) => {
        const { id } = req.params;
        try {
            const game = await Game.findByPk(id);
            if (!game) {
                return res.status(404).json({ message: "Game not found" });
            }
            res.status(200).json(game);
        } catch (error) {
            console.error('Error fetching game:', error);
            res.status(500).json({ message: "Error fetching game", error: error.message });
        }
    },
    unzipAndRunGame: async (req, res) => {
        const { id } = req.params;
        try {
            const game = await Game.findByPk(id);
            if (!game) {
                return res.status(404).json({ message: "Game not found" });
            }

            const gameDir = path.join(__dirname, '../../public/games', game.title); // Construct the game directory path

            // Check if the game directory exists
            if (!fs.existsSync(gameDir)) {
                return res.status(404).json({ message: "Game directory does not exist" });
            }

            // Execute npm install in the game directory
            exec(`cd "${gameDir}" && npm install`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing npm install: ${error.message}`);
                    return res.status(500).json({ message: "Error during npm install", error: error.message });
                }
                console.log(`npm install output: ${stdout}`);
                console.error(`npm install error output: ${stderr}`);

                // Now run npm run dev
                exec(`cd "${gameDir}" && npm run dev`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error executing npm run dev: ${error.message}`);
                        return res.status(500).json({ message: "Error starting the game", error: error.message });
                    }
                    console.log(`npm run dev output: ${stdout}`);
                    console.error(`npm run dev error output: ${stderr}`);
                    
                    // Optionally, you can send a response indicating that the command was executed
                    res.status(200).json({ message: "Game started successfully" });
                });
            });
        } catch (error) {
            console.error('Error unzipping and running game:', error);
            res.status(500).json({ message: "Error unzipping and running game", error: error.message });
        }
    },
    getGamesByCategory: async (req, res) => {
        const { category } = req.params;
        try {
            const games = await Game.findAll({ where: { category } });
            res.status(200).json(games);
        } catch (error) {
            console.error('Error fetching games by category:', error);
            res.status(500).json({ message: "Error fetching games by category", error: error.message });
        }
    },
    getCategories: async (req, res) => {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    },
    addCategory: async (req, res) => {
        const category = await Category.create({ name: req.body.name });
        res.status(201).json(category);
    }
};

// Function to extract the Vite server URL from the output
const extractViteUrl = (output) => {
    console.log("Extracting Vite URL from output:", output);
    const urlRegex = /Local:\s*(http:\/\/localhost:\d+)/;
    const match = output.match(urlRegex);
    const url = match ? match[1].trim() : null;
    console.log("Extracted Vite URL:", url);
    return url;
};