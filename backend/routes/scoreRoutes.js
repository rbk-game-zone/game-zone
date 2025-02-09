const express = require('express');
const router = express.Router();
const { getAllScores, getScoreByUserAndGame, postScore } = require('../controllers/score.controller');
const { Score } = require('../model/index');
const { User } = require('../model/index');

// Get all scores
router.get('/', getAllScores);

// Get a specific score by user_id and game_id
router.get('/:user_id/:game_id', getScoreByUserAndGame);

// Post a new score
router.post('/', postScore);

// Get leaderboard for a specific game
router.get('/:gameId/leaderboard', async (req, res) => {
    const { gameId } = req.params;
    try {
        const leaderboard = await Score.findAll({
            where: { game_id: gameId },
            order: [['score', 'DESC']],
            limit: 10, // Limit to top 10 scores
            include: [{ model: User, attributes: ['username'] }] // Include username
        });
        res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: "Error fetching leaderboard", error: error.message });
    }
});

module.exports = router; 