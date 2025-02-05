// snakeGame.js
import Phaser from 'phaser';

class SnakeGame extends Phaser.Scene {
    constructor() {
        super({ key: 'SnakeGame' });
        this.snake = [];
        this.food = null;
        this.direction = 'RIGHT';
        this.newDirection = 'RIGHT';
        this.score = 0;
    }

    preload() {
        this.load.image('food', 'assets/food.png');
        this.load.image('body', 'assets/body.png');
    }

    create() {
        // Initialize snake
        this.snake.push(this.add.rectangle(400, 300, 20, 20, 0x00ff00).setOrigin(0));
        this.food = this.add.image(100, 100, 'food').setOrigin(0);

        // Keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

        // Game loop
        this.time.addEvent({ delay: 150, callback: this.updateSnake, callbackScope: this, loop: true });
    }

    update() {
        // Change direction based on input
        if (this.cursors.left.isDown && this.direction !== 'RIGHT') this.newDirection = 'LEFT';
        if (this.cursors.right.isDown && this.direction !== 'LEFT') this.newDirection = 'RIGHT';
        if (this.cursors.up.isDown && this.direction !== 'DOWN') this.newDirection = 'UP';
        if (this.cursors.down.isDown && this.direction !== 'UP') this.newDirection = 'DOWN';
    }

    updateSnake() {
        this.direction = this.newDirection;

        // Move snake
        let head = { x: this.snake[0].x, y: this.snake[0].y };
        if (this.direction === 'LEFT') head.x -= 20;
        if (this.direction === 'RIGHT') head.x += 20;
        if (this.direction === 'UP') head.y -= 20;
        if (this.direction === 'DOWN') head.y += 20;

        // Check for food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreText.setText(`Score: ${this.score}`);
            this.food.setPosition(Math.floor(Math.random() * 20) * 20, Math.floor(Math.random() * 20) * 20);
            this.snake.push(this.add.rectangle(0, 0, 20, 20, 0x00ff00).setOrigin(0));
        }

        // Move snake body
        for (let i = this.snake.length - 1; i > 0; i--) {
            this.snake[i].x = this.snake[i - 1].x;
            this.snake[i].y = this.snake[i - 1].y;
        }
        this.snake[0].x = head.x;
        this.snake[0].y = head.y;

        // Check for game over
        if (head.x < 0 || head.x >= 800 || head.y < 0 || head.y >= 600 || this.checkCollision()) {
            this.scene.start('GameOver', { score: this.score });
        }
    }

    checkCollision() {
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[0].x === this.snake[i].x && this.snake[0].y === this.snake[i].y) return true;
        }
        return false;
    }
}

export default SnakeGame;