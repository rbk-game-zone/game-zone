import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  create() {
    this.add.text(400, 250, 'Shape Matcher Game', { 
      fontSize: '32px', 
      fill: '#ffff' 
    }).setOrigin(0.5);
    
    this.add.text(400, 300, 'Click to Start', { 
      fontSize: '24px', 
      fill: '#fff' 
    }).setOrigin(0.5);
    
    this.input.on('pointerdown', () => this.scene.start('GameScene'));
  }
}