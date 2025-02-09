export default class GameScene extends Phaser.Scene {
  private bottomShapes!: Phaser.Physics.Arcade.Group;
  private fallingShapes!: Phaser.Physics.Arcade.Group;
  private cursor!: Phaser.GameObjects.Image;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private bottomCollider!: Phaser.Physics.Arcade.Sprite; // Bottom collider object
  private backgroundMusic!: Phaser.Sound.BaseSound; // Background music property
  private currentVelocity: number = 150; // Track the current velocity of falling shapes

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Load all assets
    this.load.audio('gameMusic', '/assets/music/game-over.mp3');
    this.load.image('triangle', '/assets/triangle.png');
    this.load.image('square', '/assets/square.png');
    this.load.image('circle', '/assets/circle.png');
    this.load.image('triangle01', '/assets/triangle01.png');
    this.load.image('square01', '/assets/square01.png');
    this.load.image('circle01', '/assets/circle01.png');
    this.load.image('bottom01', '/assets/bottom01.png'); // Load the bottom image
    this.load.image('cursor', '/assets/cursor.png');
  }

  create() {
    // Initialize and play the background music
    this.backgroundMusic = this.sound.add('gameMusic', { loop: true });
    this.backgroundMusic.play();

    // Use a regular Group for bottom shapes so they can 
    this.bottomShapes = this.physics.add.group();
    this.fallingShapes = this.physics.add.group();

    // Create bottom shapes with their respective textures
    this.createBottomShape(200, 550, 'triangle01', 'triangle01');
    this.createBottomShape(400, 550, 'square01', 'square01');
    this.createBottomShape(600, 550, 'circle01', 'circle01');

    // Create the bottom collider (bottom01.png)
    this.bottomCollider = this.physics.add.sprite(700, 700, 'bottom01').setOrigin(0.5, 0.5);
    this.bottomCollider.setImmovable(true); // Make it immovable
    this.bottomCollider.setVisible(true); // Make it visible
    this.bottomCollider.displayWidth = 1400; // Set the width of the image
    this.bottomCollider.displayHeight = 50; // Set the height of the image (adjust as needed)
    this.bottomCollider.refreshBody(); // Refresh the physics body to match the new size

    // Cursor setup
    this.cursor = this.add.image(0, 0, 'cursor').setScale(0.1);
    this.input.setDefaultCursor('none');

    // Spawn one shape every second
    this.time.addEvent({
      delay: 3000,
      callback: this.spawnShape,
      callbackScope: this,
      loop: true,
    });

    // Add velocity increase timer (every 10 seconds)
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        this.currentVelocity += 20; // Increase velocity by 500 pixels/second
      },
      callbackScope: this,
      loop: true,
    });

    // Add collider between falling shapes and bottom shapes
    this.physics.add.collider(this.fallingShapes, this.bottomShapes, this.handleCollision, null, this);

    // Add collider between falling shapes and the bottom collider (bottom01.png)
    this.physics.add.collider(this.fallingShapes, this.bottomCollider, this.handleBottomCollision, null, this);

    // Score text
    this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '24px', fill: '#fff' });
  }

  update() {
    // Update cursor position
    this.cursor.x = this.input.x;
    this.cursor.y = this.input.y;

    // Move bottom shapes left and right
    if (this.input.keyboard?.addKey('LEFT').isDown) {
      this.bottomShapes.getChildren().forEach(shape => (shape.x -= 300 / 40));
    }
    if (this.input.keyboard?.addKey('RIGHT').isDown) {
      this.bottomShapes.getChildren().forEach(shape => (shape.x += 300 / 40));
    }
  }

  createBottomShape(x: number, y: number, texture: string, name: string) {
    const shape = this.bottomShapes.create(x, y, texture).setScale(0.1).refreshBody();
    shape.setName(name);
    shape.setOrigin(0.5, 0.5); // Center the origin

    // Enable physics for the bottom shape
    shape.body.setImmovable(true); // Make it immovable but still allow movement
    shape.body.setAllowGravity(false); // Disable gravity for bottom shapes
    shape.body.setSize(shape.displayWidth * 3.2, shape.displayHeight * 3.2); // Increase collider size by 20%
  }

  spawnShape() {
    const shapes = ['triangle01', 'square01', 'circle01']; // Use the falling shapes
    const randomShape = Phaser.Utils.Array.GetRandom(shapes);
    const x = Phaser.Math.Between(100, 1200);
    const y = 0;

    // Create falling shape
    const shape = this.fallingShapes.create(x, y, randomShape).setScale(0.1).setOrigin(0.5, 0.5);
    shape.setVelocityY(this.currentVelocity); // Use the current velocity
    shape.setCollideWorldBounds(true);

    // Set collider size to match the scaled size of the shape
    shape.body.setSize(shape.displayWidth * 1.2, shape.displayHeight * 1.2); // Increase collider size by 20%

    // Destroy the shape after 5 seconds if it doesn't collide
    this.time.delayedCall(5000, () => {
      if (shape.active) {
        shape.destroy();
      }
    });
  }

  handleCollision(fallingShape: Phaser.GameObjects.GameObject, bottomShape: Phaser.GameObjects.GameObject) {
    const fallingKey = fallingShape.texture.key; // Texture key of the falling shape
    const bottomName = bottomShape.name; // Name of the bottom shape

    // Check if the falling shape matches the bottom shape
    if (
      (fallingKey === 'triangle01' && bottomName === 'triangle01') ||
      (fallingKey === 'square01' && bottomName === 'square01') ||
      (fallingKey === 'circle01' && bottomName === 'circle01')
    ) {
      // Correct match: Grow the bottom shape
      bottomShape.setScale(bottomShape.scaleX + 0.05);
      fallingShape.destroy();
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);
    } else {
      // Incorrect match: End the game
      this.scene.start('GameOverScene');
    }
  }

  handleBottomCollision(fallingShape: Phaser.GameObjects.GameObject) {
    // Destroy the falling shape
    fallingShape.destroy();
    this.backgroundMusic.pause();

    // Store the score in the Data Manager before transitioning to the GameOverScene
    this.registry.set('finalScore', this.score); // Save the score

    // End the game immediately when a falling shape collides with bottom01.png
    this.scene.start('GameOverScene');
  }
}