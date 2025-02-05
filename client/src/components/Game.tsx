import React, { useEffect } from 'react';
import Phaser from 'phaser';

const Game: React.FC = () => {
    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: false
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        const game = new Phaser.Game(config);

        function preload(this: Phaser.Scene) {
            // Load game assets here
        }

        function create(this: Phaser.Scene) {
            // Create game objects here
        }

        function update(this: Phaser.Scene) {
            // Update game logic here
        }

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="game-container"></div>;
};

export default Game; 