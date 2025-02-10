export default class StartScene extends Phaser.Scene {
    constructor() {
      super({ key: 'StartScene' });
    }
  
    create() {
      this.add.text(700, 250, 'Shape Matcher Game', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(700, 300, 'try to match the falling shapes using the keyboard arrows keys  ', { fontSize: '60px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(700, 400, ' <  > up , down  ', { fontSize: '60px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(700, 500, 'Click to Start', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
      this.input.on('pointerdown', () => this.scene.start('GameScene'));
    }
  }