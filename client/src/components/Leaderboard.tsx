import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard: React.FC<{ gameId: number }> = ({ gameId }) => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                console.log("Fetching leaderboard for gameId:", gameId);
                const response = await axios.get(`http://localhost:8000/api/scores/${gameId}/leaderboard`);
                setLeaderboard(response.data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        };

        if (gameId) {
            fetchLeaderboard();
        }
    }, [gameId]);

    return (
        <div>
            <h2>Leaderboard</h2>
            <ul>
                {leaderboard.map((entry: any) => (
                    <li key={entry.id}>
                        {entry.User.username}: {entry.score}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard; 