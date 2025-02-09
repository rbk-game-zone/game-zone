import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import StartScene from '../scenes/StartScene';
import GameScene from '../scenes/GameScene';
import GameOverScene from '../scenes/GameOverScene';

const GameCanvas: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#A833FF', '#33FFF5'];

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1600,
      height: 800,
      parent: 'game-container',
      scene: [StartScene, GameScene, GameOverScene],
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      },
      backgroundColor: '#0000FF',
    };

    gameRef.current = new Phaser.Game(config);

    let colorIndex = 0;
    const interval = setInterval(() => {
      colorIndex = (colorIndex + 1) % colors.length;
      const gameContainer = document.getElementById('game-container');
      if (gameContainer) {
        gameContainer.style.backgroundColor = colors[colorIndex];
      }
    }, 10000);



    return () => {
      clearInterval(interval);
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  return <div id="game-container" style={{ width: '1600px', height: '800px' }} />;
};

export default GameCanvas;
