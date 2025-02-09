import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../client/src/store/store';

interface SnakeGameProps {
    gameId: number; // Accept gameId as a prop
}

const SnakeGame: React.FC<SnakeGameProps> = ({ gameId }) => {
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highestScore, setHighestScore] = useState(0);
    const [isGameStarted, setIsGameStarted] = useState(false);
    
    // Get userId from Redux store
    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user ? user.id : null; // Assuming user object has an id property

    useEffect(() => {
        if (!isGameStarted) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 1200,
            height: 600,
            backgroundColor: '#1E3A8A',
            scene: {
                preload: preload,
                create: create,
                update: update
            },
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            }
        };

        const game = new Phaser.Game(config);

        function preload(this: Phaser.Scene) {
            // Load any assets here if needed
        }

        let snake: Phaser.GameObjects.Rectangle[];
        let food: Phaser.GameObjects.Rectangle;
        let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
        let direction: string;
        let moveTimer: Phaser.Time.TimerEvent;
        let highestScoreText: Phaser.GameObjects.Text;
        let scoreText: Phaser.GameObjects.Text;
        const username: string = "player 000000";
        let usernameText: Phaser.GameObjects.Text;

        function create(this: Phaser.Scene) {
            snake = [];
            direction = 'RIGHT';
            setIsGameOver(false);
            setScore(0);

            // Calculate center position
            const centerX = 1200 / 2;
            const centerY = 600 / 2;

            // Create initial snake centered
            for (let i = 0; i < 5; i++) {
                snake.push(this.add.rectangle(centerX - i * 20, centerY, 20, 20, 0x00ff00));
            }

            // Create food at a random position within the canvas
            food = this.add.rectangle(
                Phaser.Math.Between(0, (1200 / 20) - 1) * 20, 
                Phaser.Math.Between(0, (600 / 20) - 1) * 20, 
                20, 
                20, 
                0xff0000
            );

            cursors = this.input.keyboard.createCursorKeys();

            usernameText = this.add.text(10, 10, username, { fontSize: '20px', fill: '#ffffff' });
            scoreText = this.add.text(10, 40, `Score: ${score}`, { fontSize: '20px', fill: '#ffffff' });
            highestScoreText = this.add.text(10, 70, `Highest Score: ${highestScore}`, { fontSize: '20px', fill: '#ffffff' });

            moveTimer = this.time.addEvent({
                delay: 100,
                callback: moveSnake,
                callbackScope: this,
                loop: true
            });
        }

        function update(this: Phaser.Scene) {
            if (isGameOver) return;

            if (cursors.left.isDown) {
                direction = 'LEFT';
            } else if (cursors.right.isDown) {
                direction = 'RIGHT';
            } else if (cursors.up.isDown) {
                direction = 'UP';
            } else if (cursors.down.isDown) {
                direction = 'DOWN';
            }
        }

        function moveSnake(this: Phaser.Scene) {
            const head = snake[0];
            let newHead: Phaser.GameObjects.Rectangle = this.add.rectangle(0, 0, 20, 20, 0x00ff00);

            switch (direction) {
                case 'LEFT':
                    newHead.setPosition(head.x - 20, head.y);
                    break;
                case 'RIGHT':
                    newHead.setPosition(head.x + 20, head.y);
                    break;
                case 'UP':
                    newHead.setPosition(head.x, head.y - 20);
                    break;
                case 'DOWN':
                    newHead.setPosition(head.x, head.y + 20);
                    break;
            }

            if (newHead.x < 0 || newHead.x >= 1200 || newHead.y < 0 || newHead.y >= 600) {
                gameOver();
                return;
            }

            for (let i = 1; i < snake.length; i++) {
                if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
                    gameOver();
                    return;
                }
            }

            snake.unshift(newHead);
            if (newHead.x === food.x && newHead.y === food.y) {
                food.setPosition(Phaser.Math.Between(0, (1200 / 20) - 1) * 20, Phaser.Math.Between(0, (600 / 20) - 1) * 20);
                setScore(prevScore => {
                    const newScore = prevScore + 10;
                    scoreText.setText(`Score: ${newScore}`);
                    if (newScore > highestScore) {
                        setHighestScore(newScore);
                        highestScoreText.setText(`Highest Score: ${newScore}`);
                    }
                    return newScore;
                });
            } else {
                const tail = snake.pop();
                if (tail) {
                    tail.destroy();
                }
            }
        }

        function gameOver() {
            setIsGameOver(true);
            moveTimer.destroy(); // Stop the snake movement
            game.destroy(true); // Destroy the Phaser game instance
            if (userId && gameId) {
                submitScore(userId, gameId, score); // Submit the score
            }
        }

        const submitScore = async (userId: number, gameId: number, score: number) => {
            try {
                const response = await axios.post('http://localhost:8000/api/scores', {
                    user_id: userId,
                    game_id: gameId,
                    score: score,
                });
                console.log('Score submitted successfully:', response.data);
            } catch (error) {
                console.error('Error submitting score:', error.response ? error.response.data : error.message);
            }
        };

        return () => {
            game.destroy(true);
        };
    }, [isGameStarted]);

    const handleStartGame = () => {
        setIsGameStarted(true);
    };

    const handleRestart = () => {
        setIsGameOver(false);
        setScore(0);
        setIsGameStarted(false);
    };

    return (
        <div id="game-container">
            {!isGameStarted && <StartScreen onStart={handleStartGame} />}
            {isGameStarted && !isGameOver }
            {isGameOver && <GameOverScreen 
                score={score} 
                highestScore={highestScore} 
                onRestart={handleRestart} 
            />}
        </div>
    );
};

export default SnakeGame;