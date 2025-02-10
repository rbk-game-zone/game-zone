import React, { useEffect, useState } from 'react'
import axios from "axios"
import './ScoreFinal.css';
import ScorePopup from './ScorePopup';

function ScoreFinal() {
    const [rankedScores, setRankedScores] = useState([]);
    const [selectedScore, setSelectedScore] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/scores`);
                setRankedScores(response.data);
            } catch (error) {
                console.error("Error fetching scores:", error);
            }
        };

        fetchScores();
    }, []);

    const handleScoreClick = (scoreDetails) => {
        setSelectedScore(scoreDetails);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedScore(null);
    };

    return (
        <div className="score-section">
            <h1 className="score-title">🏆 Ranked Scores 🏆</h1>
            {rankedScores.map((game) => (
                <div key={game.id} className="game-container">
                    <h2 className="game-title" onClick={() => handleScoreClick(game)}>{game.game}</h2>
                </div>
            ))}
            <ScorePopup isOpen={isPopupOpen} onClose={closePopup} scoreDetails={selectedScore} />
        </div>
    );
}

export default ScoreFinal
