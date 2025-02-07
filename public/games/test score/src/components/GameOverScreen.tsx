import React from 'react';

interface GameOverScreenProps {
    score: number;
    highestScore: number;
    onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highestScore, onRestart }) => {

  let scoreValue = highestScore;
  localStorage.setItem("score", highestScore); 
  console.log("highestScore", highestScore);
  
  
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#1E3A8A', color: 'white' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Game Over</h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your Score: {score}</p>
        <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Highest Score: {highestScore}</p>
        <button
          onClick={onRestart}
          style={{
            backgroundColor: '#3B82F6',
            color: 'white',
            fontWeight: 'bold',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            transition: 'background-color 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#1D4ED8')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#3B82F6')}
        >
          Restart Game
        </button>
      </div>
      
    );
};

// Function to get the score value
export const getScoreValue = () => scoreValue; // Exporting a function to get the score

export default GameOverScreen; 