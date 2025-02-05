// SnakeGameComponent.js
import React, { useEffect } from 'react';
import Phaser from 'phaser';
import SnakeGame from './snakeGame';

const SnakeGameComponent = () => {
    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            scene: [SnakeGame],
        };
        const game = new Phaser.Game(config);
        return () => game.destroy(true);
    }, []);

    return <div id="game-container"></div>;
};

export default SnakeGameComponent;