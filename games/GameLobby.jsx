// GameLobby.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DynamicGameLoader from './DynamicGameLoader';

const GameLobby = () => {
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get('/api/games');
                console.log("Fetched games:", response.data); // Log the response
                setGames(response.data);
            } catch (error) {
                console.error("Error fetching games:", error);
                setGames([]);
            }
        };
        fetchGames();
    }, []);
// console.log("games",games);

    return (
        <div>
            <h1>Game Lobby</h1>
            <div>
                <h2>Select a Game</h2>
                {games.map((game) => (
                    <div key={game.id} onClick={() => setSelectedGame(game.game_file)}>
                        <h3>{game.title}</h3>
                        <p>{game.description}</p>
                    </div>
                ))}
            </div>
            {selectedGame && <DynamicGameLoader gameName={selectedGame} />}
        </div>
    );
};

export default GameLobby;