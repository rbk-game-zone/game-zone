const { Score } = require('../model/index');

// Function to submit score
const submitScore = async (userId, gameId, score) => {
    try {
        const [scoreEntry, created] = await Score.upsert({
            user_id: userId,
            game_id: gameId,
            score,
        });
        return { message: created ? 'Score created' : 'Score updated', scoreEntry };
    } catch (error) {
        throw new Error('Error submitting score: ' + error.message);
    }
};

// Function to get leaderboard
const getLeaderboard = async (gameId) => {
    try {
        const scores = await Score.findAll({
            where: { game_id: gameId },
            order: [['score', 'DESC']],
            include: [{ model: User, attributes: ['username'] }],
        });
        return scores;
    } catch (error) {
        throw new Error('Error fetching leaderboard: ' + error.message);
    }
};

module.exports = { submitScore, getLeaderboard };