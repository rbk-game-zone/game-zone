import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import StartScene from '../../../game-joi/src/scenes/StartScene';
import GameScene from '../../../game-joi/src/scenes/GameScene';
import GameOverScene from '../../../game-joi/src/scenes/GameOverScene';

const Game: React.FC = () => {
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 200 }
                }
            },
            scene: [StartScene, GameScene, GameOverScene]
        };

        gameRef.current = new Phaser.Game(config);

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
            }
        };
    }, []);

    return <div id="game-container" style={{ width: '100%', height: '100%' }} />;
};

export default Game; 