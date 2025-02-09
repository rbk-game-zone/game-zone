import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation

interface ScoreProps {
    highestScore: number; // Define props interface
    userd: any; // Add this if you need it
    games: any; // Add this if you need it
}

const Score: React.FC<ScoreProps> = ({ highestScore}) => {
    const location = useLocation(); // Get the current location
    const query = new URLSearchParams(location.search); // Parse the query parameters
    const userId = query.get('userId'); // Get userId from query parameters
    const gameId = query.get('gameId'); // Get gameId from query parameters
console.log("userd",userd);
console.log("games",games);


    // Use highestScore as needed in your component

    return (
        <div>
            <h1>Your Highest Score: {highestScore}</h1>
            {/* Render other score information */}
        </div>
    );
};

export default Score;
