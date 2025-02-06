export default class GameOverScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameOverScene' });
      
      
    }
  
    create() {
      const gameScene = this.scene.get('GameScene');
      console.log("score",gameScene.data.get('score'));
      this.add.text(700, 250, 'Game Over', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(700, 300, `Final Score: ${gameScene.data.get('score')}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(700, 350, 'Click to Restart', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
      this.input.on('pointerdown', () => this.scene.start('GameScene'));
    }
  }