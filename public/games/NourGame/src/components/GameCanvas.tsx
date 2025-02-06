import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import StartScene from '../scenes/StartScene';
import GameScene from '../scenes/GameScene';
import GameOverScene from '../scenes/GameOverScene';

const GameCanvas: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

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
          // gravity: { y: 0 },
          debug: false
        }
      },
      backgroundColor: '#0000FF',  // Set your desired background color here
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  return <div id="game-container" />;
};

export default GameCanvas;
