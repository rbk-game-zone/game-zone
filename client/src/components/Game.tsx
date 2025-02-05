import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface GameData {
    id: number;
    title: string;
    description: string;
    game_file: string;
    thumbnail: string;
}

const Game: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [gameUrl, setGameUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                // Fetch the game data
                const response = await axios.get(`/api/games/${id}`);
                const gameData = response.data;

                if (!gameData || !gameData.game_file) {
                    throw new Error('Game file path is missing');
                }

                // Construct the full URL for the game file
                const gameFileUrl = `http://localhost:8000/${gameData.game_file}`;
                console.log('Game URL:', gameFileUrl); // Debug log

                // Set the game URL directly since it's already a file path
                setGameUrl(gameFileUrl);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching game:', err);
                setError('Failed to load the game. Please try again later.');
                setLoading(false);
            }
        };

        if (id) {
            fetchGame();
        }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div id="game-container" style={{ width: '100%', height: '100vh' }}>
            {gameUrl && (
                <iframe
                    src={gameUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Game"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
            )}
        </div>
    );
};

export default Game; 