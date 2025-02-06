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
    const [games, setGames] = useState<GameData[]>([]);
console.log("games",games);


    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/'); // Fetch all games
                setGames(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching games:', err);
                setError('Failed to load games. Please try again later.');
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    const handleGameClick = async (gameId: number) => {
        try {
            // Trigger the backend to unzip and run the game
            const response = await axios.post(`http://localhost:8000/api/unzip/${gameId}`);
            console.log('Game started:', response.data);
        } catch (err) {
            console.error('Error starting game:', err);
            alert('Failed to start the game. Please try again later.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
// console.log("games",games);

    return (
        <div id="game-container" style={{ width: '100%', height: '100vh' }}>
            {games && (
                <iframe
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Game"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
            )}
            <div className="game-container">
                {Array.isArray(games) && games.length > 0 ? (
                    games.map((game) => (
                        <div key={game.id} className="game-card" onClick={() => handleGameClick(game.id)}>
                            <img src={game.thumbnail} alt={game.title} style={{width: '300px'}} />
                            <h3>{game.title}</h3>
                            <p>{game.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No games available.</p>
                )}
            </div>
        </div>
    );
};

export default Game; 