import React from 'react';
import './ScorePopup.css'; // Optional: Add styles for the popup

interface ScorePopupProps {
    isOpen: boolean;
    onClose: () => void;
    scoreDetails: any; // Adjust the type as needed
}

const ScorePopup: React.FC<ScorePopupProps> = ({ isOpen, onClose, scoreDetails }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>{scoreDetails.game}</h2>
                <h3>Scores:</h3>
                <ul>
                    {scoreDetails.scores.map((score: any) => {
                        // Determine emoji based on rank
                        let emoji = '';
                        if (score.rank === 1) emoji = '🏆'; // Trophy for 1st place
                        else if (score.rank <= 3) emoji = '🥈'; // Silver medal for 2nd and 3rd
                        else emoji = '🎖️'; // Participation medal for others

                        return (
                            <li key={score.rank}>
                                {emoji} <span className="rank">{score.rank}</span>: <span className="user">{score.user}</span> Score: <span className="score">{score.score}</span>
                            </li>
                        );
                    })}
                </ul>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ScorePopup; 