import { useEffect } from "react"
import Phaser from "phaser"
import plane from "./assets/Clipped_image_20250206_164101.png"
import space from "./assets/bring-night-space-wallpaper-with-glowing-starfield_1017-53512.avif"

class StartScene extends Phaser.Scene {
  maxScore = 0

  constructor() {
    super("start-scene")
  }

  preload() {
    // Load the space background image
    this.load.image("spaceBackground", space)
  }

  create() {
    // Add the space background
    const background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "spaceBackground")
    background.setDisplaySize(this.cameras.main.width, this.cameras.main.height)

    const savedMaxScore = localStorage.getItem("maxScore")
    this.maxScore = savedMaxScore ? Number.parseInt(savedMaxScore, 10) : 0

    // Add max score text with a glowing effect
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY - 100, `Max Score: ${this.maxScore}`, {
        fontSize: "32px",
        color: "#fff",
        fontFamily: "Arial",
        stroke: "#000",
        strokeThickness: 4,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#00ff00",
          blur: 4,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(0.5)
      // console.log(this.score);

    // Add start button with a space-themed style
    const startButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, "Start Game", {
        fontSize: "48px",
        color: "#fff",
        fontFamily: "Arial",
        backgroundColor: "#000",
        padding: { x: 20, y: 10 },
        stroke: "#00ff00",
        strokeThickness: 2,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#00ff00",
          blur: 4,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setInteractive()

    // Add hover effect to the start button
    startButton.on("pointerover", () => {
      startButton.setStyle({ fill: "#00ff00", backgroundColor: "#333" })
    })

    startButton.on("pointerout", () => {
      startButton.setStyle({ fill: "#fff", backgroundColor: "#000" })
    })

    startButton.on("pointerdown", () => this.scene.start("game-scene"))
  }
}

class GameScene extends Phaser.Scene {
  airplane!: Phaser.Physics.Arcade.Image
  bullets!: Phaser.Physics.Arcade.Group
  meteorites!: Phaser.Physics.Arcade.Group
  healthText!: Phaser.GameObjects.Text
  scoreText!: Phaser.GameObjects.Text
  gameOverText!: Phaser.GameObjects.Text
  tryAgainButton!: Phaser.GameObjects.Text
  backToStartButton!: Phaser.GameObjects.Text
  pauseButton!: Phaser.GameObjects.Text
  backToStartFromPauseButton!: Phaser.GameObjects.Text

  // Background layers
  bgLayers: Phaser.GameObjects.TileSprite[] = []

  health = 3
  score = 0
  maxScore = 0
  gameOver = false
  isPaused = false

  bulletSpeed = 1200
  meteorSpeed = 200 // Initial meteor speed
  meteorSpawnRate = 1000 // Initial spawn rate

  constructor() {
    super("game-scene")
  }

  preload() {
    this.load.image("sky", space)
    this.load.image("airplane", plane)
    this.load.image(
      "meteor",
      "https://cdn.discordapp.com/attachments/1313211740913274920/1337536629467774986/Clipped_image_20250207_223236.png?ex=67a7cd8e&is=67a67c0e&hm=3e66cc601e6c778dd8a033f3da09ee52d0476f13714be2e9f814453b0e8830d8&",
    )

    // Load space background layers
    this.load.image(
      "space1",
      "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1024",
    )
    this.load.image(
      "space2",
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1024",
    )
    this.load.image("stars", "https://images.unsplash.com/photo-1537420327992-d6e192287183?auto=format&fit=crop&w=1024")
  }

  create() {
    this.resetGameState()

    // Create parallax background layers
    const gameWidth = this.cameras.main.width
    const gameHeight = this.cameras.main.height

    this.bgLayers = [
      this.add.tileSprite(0, 0, gameWidth, gameHeight, "space1").setOrigin(0, 0).setScrollFactor(0).setAlpha(0.6),
      this.add.tileSprite(0, 0, gameWidth, gameHeight, "space2").setOrigin(0, 0).setScrollFactor(0).setAlpha(0.4),
      this.add.tileSprite(0, 0, gameWidth, gameHeight, "stars").setOrigin(0, 0).setScrollFactor(0).setAlpha(0.8),
    ]

    // Create a laser graphic
    const graphics = this.add.graphics()
    graphics.fillStyle(0x00ff00, 1) // Neon green color
    graphics.fillRect(0, 0, 5, 20) // Thin rectangle (5px wide, 20px tall)
    graphics.generateTexture("laser", 5, 20) // Save as a texture
    graphics.destroy() // Clean up

    this.airplane = this.physics.add
      .image(this.cameras.main.centerX, this.cameras.main.centerY, "airplane")
      .setCollideWorldBounds(true)
      .setScale(0.1) // Airplane scaled down to 10%

    this.bullets = this.physics.add.group()
    this.meteorites = this.physics.add.group()

    this.healthText = this.add.text(20, 20, `Health: ${this.health}`, { fontSize: "24px", color: "#fff" })
    this.scoreText = this.add.text(20, 50, `Score: ${this.score}`, { fontSize: "24px", color: "#fff" })

    // Spawn meteorites at the initial rate
    this.time.addEvent({
      delay: this.meteorSpawnRate,
      callback: this.spawnMeteorite,
      callbackScope: this,
      loop: true,
    })

    this.physics.add.overlap(this.bullets, this.meteorites, this.destroyMeteorite, undefined, this)
    this.physics.add.overlap(this.airplane, this.meteorites, this.hitByMeteorite, undefined, this)

    this.pauseButton = this.add
      .text(this.cameras.main.width - 100, 20, "Pause", {
        fontSize: "24px",
        color: "#fff",
        backgroundColor: "#000",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()

    this.pauseButton.on("pointerdown", () => this.togglePause())
  }

  update() {
    if (this.isPaused) return

    // Update background parallax
    this.bgLayers[0].tilePositionY -= 0.5 // Slowest layer
    this.bgLayers[1].tilePositionY -= 1 // Medium speed layer
    this.bgLayers[2].tilePositionY -= 1.5 // Fastest layer

    // Add subtle horizontal movement to stars
    this.bgLayers[2].tilePositionX += 0.1

    const cursorKeys = this.input.keyboard.createCursorKeys()
    const speed = 500

    this.airplane.setVelocity(
      cursorKeys.left.isDown ? -speed : cursorKeys.right.isDown ? speed : 0,
      cursorKeys.up.isDown ? -speed : cursorKeys.down.isDown ? speed : 0,
    )

    if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), 500)) {
      this.shootBullet()
    }

    // Adjust difficulty based on score
    this.adjustDifficulty()
  }

  adjustDifficulty() {
    if (this.score >= 150) {
      this.meteorSpawnRate = 400 // Faster spawn
      this.meteorSpeed = 500 // Faster falling
    } else if (this.score >= 100) {
      this.meteorSpawnRate = 600 // Medium spawn
      this.meteorSpeed = 400 // Medium falling
    } else if (this.score >= 50) {
      this.meteorSpawnRate = 800 // Slower spawn
      this.meteorSpeed = 300 // Slower falling
    }
  }

  shootBullet() {
    if (this.gameOver || this.isPaused) return

    // Create a laser beam
    const laser = this.bullets.create(this.airplane.x, this.airplane.y, "laser")
    laser.setScale(0.5) // Adjust scale if needed
    laser.setVelocityY(-this.bulletSpeed) // Move upward

    // Add a glowing effect
    laser.setBlendMode(Phaser.BlendModes.ADD) // Additive blending for glow
    laser.setAlpha(0.8) // Slightly transparent

    // Destroy the laser when it goes off-screen
    this.time.delayedCall(1000, () => {
      if (laser && laser.active) {
        laser.destroy()
      }
    })
  }

  spawnMeteorite() {
    if (this.gameOver || this.isPaused) return
    const xPosition = Phaser.Math.Between(50, this.cameras.main.width - 50)
    const meteorite = this.meteorites.create(xPosition, 0, "meteor")
    meteorite
      .setVelocityY(this.meteorSpeed)
      .setScale(0.15)
      .setRotation(Math.random() * Math.PI * 2)
      .setAngularVelocity(Phaser.Math.Between(-100, 100))
  }

  destroyMeteorite(laser: Phaser.Physics.Arcade.Image, meteorite: Phaser.Physics.Arcade.Image) {
    laser.destroy()
    meteorite.destroy()
    this.score += 5
    this.scoreText.setText(`Score: ${this.score}`)

    if (this.score > this.maxScore) {
      this.maxScore = this.score
    }
  }

  hitByMeteorite(airplane: Phaser.Physics.Arcade.Image, meteorite: Phaser.Physics.Arcade.Image) {
    meteorite.destroy()
    this.takeDamage()
  }

  takeDamage() {
    this.health -= 1
    this.healthText.setText(`Health: ${this.health}`)
    this.airplane.setTint(0xff0000)
    this.time.delayedCall(500, () => this.airplane.clearTint())

    if (this.health <= 0) this.gameOverSequence()
  }

  gameOverSequence() {
    this.gameOver = true
    this.physics.pause()

    // Disable the pause button during the game over sequence
    if (this.pauseButton) {
      this.pauseButton.setVisible(false) // Hide the pause button when the game is over
    }

    localStorage.setItem("maxScore", this.maxScore.toString())

    this.gameOverText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 50,
        `Game Over\nScore: ${this.score}\nMax Score: ${this.maxScore}`,
        {
          fontSize: "48px",
          color: "#ff0000",
          align: "center",
        },
      )
      .setOrigin(0.5)

    this.tryAgainButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY + 50, "Try Again", {
        fontSize: "32px",
        color: "#fff",
        backgroundColor: "#000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()

    this.tryAgainButton.on("pointerdown", () => this.restartGame())

    this.backToStartButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY + 100, "Back to Start", {
        fontSize: "32px",
        color: "#fff",
        backgroundColor: "#000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()

    this.backToStartButton.on("pointerdown", () => this.scene.start("start-scene"))
  }

  restartGame() {
    this.scene.restart()
  }

  resetGameState() {
    this.health = 3
    this.score = 0
    this.gameOver = false
    this.isPaused = false
    this.meteorSpawnRate = 1000 // Reset spawn rate
    this.meteorSpeed = 200 // Reset meteor speed
  }

  togglePause() {
    // Prevent toggling pause when the game is over
    if (this.gameOver) return

    this.isPaused = !this.isPaused

    if (this.isPaused) {
      this.physics.pause()
      this.pauseButton.setText("Resume")

      this.backToStartFromPauseButton = this.add
        .text(this.cameras.main.centerX, this.cameras.main.centerY + 150, "Back to Start", {
          fontSize: "32px",
          color: "#fff",
          backgroundColor: "#000",
          padding: { x: 20, y: 10 },
        })
        .setOrigin(0.5)
        .setInteractive()

      this.backToStartFromPauseButton.on("pointerdown", () => this.scene.start("start-scene"))
    } else {
      this.physics.resume()
      this.pauseButton.setText("Pause")

      if (this.backToStartFromPauseButton) {
        this.backToStartFromPauseButton.destroy()
      }
    }
  }
}

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  body {
    background: black;
    overflow: hidden;
  }

  #game-container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000;
    will-change: transform;
  }

  canvas {
    width: 100%;
    height: 100%;
    display: block;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    touch-action: none;
  }

  @media (min-resolution: 2dppx) {
    canvas {
      image-rendering: auto;
    }
  }

  ::-webkit-scrollbar {
    display: none;
  }
`

const App = () => {
  useEffect(() => {
    const styleSheet = document.createElement("style")
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [StartScene, GameScene],
      physics: { default: "arcade", arcade: { gravity: { y: 0 }, debug: false } },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    })

    return () => {
      game.destroy(true)
      document.head.removeChild(styleSheet)
    }
  }, [])

  return <div id="game-container" />
}

export default App

