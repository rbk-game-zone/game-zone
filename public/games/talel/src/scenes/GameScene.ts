export default class GameScene extends Phaser.Scene {
  private bottomShapes!: Phaser.Physics.Arcade.Group; // Use Group instead of StaticGroup
  private fallingShapes!: Phaser.Physics.Arcade.Group;
  private cursor!: Phaser.GameObjects.Image;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Load assets
    this.load.image('triangle', '/assest/triangle.png');
    this.load.image('triangle01', '/assest/triangle01.png');
    this.load.image('circle', '/assest/circle.png');
    this.load.image('square', '/assest/square.png');
    this.load.image('circle01', '/assest/circle01.png');
    this.load.image('square01', '/assest/square01.png');
    this.load.image('cursor', '/assest/cursor.png');
  }

  create() {
    // Use a regular Group for bottom shapes so they can move
    this.bottomShapes = this.physics.add.group();
    this.fallingShapes = this.physics.add.group();

    // Create bottom shapes with their respective textures
    this.createBottomShape(200, 550, 'triangle01', 'triangle01');
    this.createBottomShape(400, 550, 'square01', 'square01');
    this.createBottomShape(600, 550, 'circle01', 'circle01');

    // Cursor setup
    this.cursor = this.add.image(0, 0, 'cursor').setScale(0.1);
    this.input.setDefaultCursor('none');

    // Spawn one shape every second
    this.time.addEvent({
      delay: 1000,
      callback: this.spawnShape,
      callbackScope: this,
      loop: true,
    });

    // Add collider between falling shapes and bottom shapes
    this.physics.add.collider(this.fallingShapes, this.bottomShapes, this.handleCollision, null, this);

    // Score text
    this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '24px', fill: '#fff' });

    // Debug: Enable physics debug to visualize colliders
    this.physics.world.createDebugGraphic();
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
    const shapes = ['triangle', 'square', 'circle'];
    const randomShape = Phaser.Utils.Array.GetRandom(shapes);
    const x = Phaser.Math.Between(100, 1200);
    const y = 0;

    // Create falling shape
    const shape = this.fallingShapes.create(x, y, randomShape).setScale(0.1).setOrigin(0.5, 0.5);
    shape.setVelocityY(150);
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
      (fallingKey === 'triangle' && bottomName === 'triangle01') ||
      (fallingKey === 'square' && bottomName === 'square01') ||
      (fallingKey === 'circle' && bottomName === 'circle01')
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
}