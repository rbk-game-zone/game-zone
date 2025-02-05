import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import StartScene from '../scenes/StartScene';
import GameScene from '../scenes/GameScene';
import GameOverScene from '../scenes/GameOverScene';

const GameCanvas: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
          debug: false,
        },
      },
      backgroundColor: '#0000FF', // Initial background color
    };

    // Initialize the Phaser game
    gameRef.current = new Phaser.Game(config);

    // Function to change the background color
    const changeBackgroundColor = () => {
      const colors = ['#0000FF', '#FF0000', '#00FF00', '#FFFF00', '#00FFFF', '#FF00FF']; // Add more colors if needed
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      if (gameRef.current) {
        gameRef.current.config.backgroundColor = randomColor;
        // Force the renderer to update the background color
        gameRef.current.renderer.setBackgroundColor(randomColor);
      }
    };

    // Set an interval to change the background color every 10 seconds
    intervalRef.current = setInterval(changeBackgroundColor, 10000);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Clear the interval
      }
      if (gameRef.current) {
        gameRef.current.destroy(true); // Destroy the Phaser game instance
      }
    };
  }, []);

  return <div id="game-container" />;
};

export default GameCanvas;