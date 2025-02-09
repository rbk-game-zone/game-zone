import React from 'react';
import GameCanvas from './components/GameCanvas';

const App: React.FC = () => {
  return (
    <div>
      <h1>Shape Matcher Game</h1>
      <GameCanvas />
    </div>
  );
};

export default App;