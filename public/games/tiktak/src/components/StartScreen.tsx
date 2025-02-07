import React from 'react';

interface StartScreenProps {
    onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
    return (
        <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#1e3a8a',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            marginBottom: '24px',
            fontWeight: 'bold',
          }}
        >
          Welcome to Snake Game
        </h1>
        <button
          onClick={onStart}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            fontWeight: 'bold',
            padding: '12px 24px',
            borderRadius: '6px',
            transition: 'background-color 0.3s ease',
            cursor: 'pointer',
            border: 'none',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
        >
          Start Game
        </button>
      </div>
    );
};

export default StartScreen; 