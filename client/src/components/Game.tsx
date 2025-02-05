import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import StartScene from '../../../game-joi/src/scenes/StartScene';
import GameScene from '../../../game-joi/src/scenes/GameScene';
import GameOverScene from '../../../game-joi/src/scenes/GameOverScene';
import axios from 'axios';

const Game: React.FC = () => {
    const gameRef = useRef<Phaser.Game | null>(null);
    const [gameData, setGameData] = useState(null);

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

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await axios.get('/api/games/1'); // Replace with your game ID
                setGameData(response.data);
            } catch (error) {
                console.error('Error fetching game:', error);
            }
        };

        fetchGame();
    }, []);

    return (
        <div id="game-container">
            {gameData && (
                <>
                    <img src={gameData.thumbnail} alt="Game Thumbnail" />
                    <iframe 
                        src={gameData.game_file} 
                        style={{ width: '100%', height: '100vh' }}
                        title="Game"
                    />
                </>
            )}
        </div>
    );
};

export default Game; 