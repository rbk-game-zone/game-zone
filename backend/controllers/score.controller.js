const { Score, User, Game } = require('../model/index');

module.exports = {
    // Get all scores ordered by score for each game
    getAllScores: async (req, res) => {
        try {
            const scores = await Score.findAll({
                include: [
                    { model: User, attributes: ['id', 'username'] }, // Include user details
                    { model: Game, attributes: ['id', 'title'] } // Include game details
                ],
                order: [['score', 'DESC']] // Order by score descending
            });

            // Group scores by game
            const groupedScores = scores.reduce((acc, score) => {
                const gameTitle = score.Game.title;
                if (!acc[gameTitle]) {
                    acc[gameTitle] = [];
                }
                acc[gameTitle].push(score);
                return acc;
            }, {});

            // Calculate ranks for each game
            const rankedScores = Object.keys(groupedScores).map(gameTitle => {
                return {
                    game: gameTitle,
                    scores: groupedScores[gameTitle].map((score, index) => ({
                        rank: index + 1, // Rank starts from 1
                        user: score.User.username,
                        score: score.score
                    }))
                };
            });

            res.status(200).json(rankedScores);
        } catch (error) {
            console.error('Error fetching scores:', error);
            res.status(500).json({ message: "Error fetching scores", error: error.message });
        }
    },

    // Get a specific score by user_id and game_id
    getScoreByUserAndGame: async (req, res) => {
        const { user_id, game_id } = req.params;
        try {
            const score = await Score.findOne({
                where: { user_id, game_id },
                include: [
                    { model: User, attributes: ['id', 'username'] },
                    { model: Game, attributes: ['id', 'title'] }
                ]
            });
            if (!score) {
                return res.status(404).json({ message: "Score not found" });
            }
            res.status(200).json(score);
        } catch (error) {
            console.error('Error fetching score:', error);
            res.status(500).json({ message: "Error fetching score", error: error.message });
        }
    },

    // Post a new score
    postScore: async (req, res) => {
        const { user_id, game_id, score } = req.body;
        try {
            // Check if user_id, game_id, and score are defined
            if (!user_id || !game_id || score === undefined) {
                return res.status(400).json({ message: "Missing required fields: user_id, game_id, or score." });
            }

            // Check if a score already exists for this user and game
            const existingScore = await Score.findOne({
                where: { user_id, game_id }
            });

            const newScore = await Score.create({ user_id, game_id, score });
            res.status(201).json({ message: 'Score created successfully', score: newScore });
        } catch (error) {
            console.error('Error creating score:', error);
            res.status(500).json({ message: "Error creating score", error: error.message });
        }
    }
}; 