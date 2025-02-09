import React, { useEffect } from 'react';
import axios from 'axios';

interface ScoreProps {
    userId: number;
    gameId: number;
    score: number;
}

const Score: React.FC<ScoreProps> = ({ userId, gameId, score }) => {
    useEffect(() => {
        const submitScore = async () => {
            try {
                await axios.post('http://localhost:8000/api/scores', {
                    user_id: userId,
                    game_id: gameId,
                    score: score,
                });
                console.log('Score submitted successfully');
            } catch (error) {
                console.error('Error submitting score:', error);
            }
        };

        submitScore();
    }, [userId, gameId, score]);

    return null; // This component does not render anything
};

export default Score; 