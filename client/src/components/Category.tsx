import React , { useState, useEffect } from 'react';
import axios from 'axios';
import type { Category } from "../types/tables/category"

const Category = ({ games }: { games: any }) => {
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [filteredGames, setFilteredGames] = useState(games);
  
    console.log(games, "gamesss");

    // Dynamically use the VITE_API_URL from .env
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // Filter games based on search query
        if (searchQuery) {
            const filtered = games.filter((game: any) => 
                game.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredGames(filtered);
        } else {
            setFilteredGames(games);
        }
    }, [searchQuery, games]);

    const handleGameClick = async (gameId: string) => {
        try {
            // Use the dynamic API URL from .env
            await axios.post(`${API_URL}/api/unzip/${gameId}`);
        } catch (err) {
            alert("Failed to start the game. Please try again later.");
        }
    };

    return (
        <div className="container mt-4">
            <h1 id="gamelobby" className="text-center mb-4">Category</h1>
            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                />
            </div>
            <div className="row">
                {filteredGames.map((game: any) => (
                    <div key={game.id} className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm" onClick={() => handleGameClick(game.id)}>
                            <img src={game.thumbnail} className="card-img-top game-thumbnail" alt={game.title} />
                            <div className="card-body">
                                <h5 className="card-title">{game.title}</h5>
                                <div className="card-description">
                                    <p>{game.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
