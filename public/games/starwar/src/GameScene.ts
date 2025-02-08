import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  private player: Phaser.GameObjects.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private asteroids: Phaser.GameObjects.Group;

  constructor() {
    super("gameScene");
  }

  preload() {
    this.load.image("spaceship", "path_to_spaceship_image.png");
    this.load.image("asteroid", "path_to_asteroid_image.png");
  }

  create() {
    this.player = this.physics.add.sprite(400, 300, "spaceship");
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.asteroids = this.add.group({
      key: "asteroid",
      repeat: 10,
      setXY: { x: Phaser.Math.Between(100, 700), y: 0, stepX: 100 },
    });

    this.asteroids.children.iterate((asteroid: Phaser.GameObjects.Sprite) => {
      asteroid.setVelocity(0, Phaser.Math.Between(100, 200));
      asteroid.setRotation(Phaser.Math.Between(0, 360));
    });
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-200);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(200);
    } else {
      this.player.setVelocityY(0);
    }

    this.physics.world.collide(this.player, this.asteroids, this.handleCollision, null, this);
  }

  handleCollision(player: Phaser.GameObjects.Sprite, asteroid: Phaser.GameObjects.Sprite) {
    asteroid.setTint(0xff0000); // Tint red on collision
    player.setTint(0xff0000); // Tint player red on collision
    this.physics.pause();
    this.scene.restart();
  }
}
