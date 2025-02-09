import React, { useEffect, useState } from 'react'
import axios from "axios"
   

function scorefinal() {
    const [rankedScores, setRankedScores] = useState([]);
    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/scores");
                setRankedScores(response.data);
            } catch (error) {
                console.error("Error fetching scores:", error);
            }
        };

        fetchScores();
    }, []);
  return (
    <div style={{color:"red"}} className="score-section">
    <h1>Ranked Scores</h1>
    {rankedScores.map((game) => (
        <div key={game.game}>
            <h2>{game.game}</h2>
            <ul>
                {game.scores.map((score) => (
                    <li key={score.rank}>
                        {score.rank} : {score.user} Score: {score.score}
                    </li>
                ))}
            </ul>
        </div>
    ))}
</div>
  )
}

export default scorefinal
