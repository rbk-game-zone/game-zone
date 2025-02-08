import React from 'react';
import axios from 'axios';

const Category = ({ games }: { games: any }) => {
    
    const handleGameClick = async (gameId) => {
        try {
            await axios.post(`http://localhost:8000/api/unzip/${gameId}`);
        } catch (err) {
            alert("Failed to start the game. Please try again later.");
        }
    };
    return (
        <div className="container mt-4">
            <div className="row">
                {games.map((game: any) => (
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
