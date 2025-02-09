// src/FlappyBird.js
import React, { useEffect, useState, useRef } from "react";
import Phaser from "phaser";
import StartScreen from "./screens/StartScreen";
import EndScreen from "./screens/EndScreen";
import backgroundImage from "./assets/background-day.png"; // Import the background image
import reboundImage from "./assets/base.png"; // Import the rebound image

const FlappyBird = () => {
  const [gameState, setGameState] = useState("start"); // start, playing, end
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const gameRef = useRef(null);

  // Load highest score from localStorage on component mount
  useEffect(() => {
    const storedHighestScore = parseInt(localStorage.getItem("highestScoreflappy")) || 0;
    setHighestScore(storedHighestScore);
  }, []);

  useEffect(() => {
    if (gameState === "playing") {
      const config = {
        type: Phaser.AUTO,
        width: 400,
        height: 600,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 500 },
            debug: false,
          },
        },
        scene: {
          preload: preload,
          create: create,
          update: update,
        },
      };

      const game = new Phaser.Game(config);
      gameRef.current = game;

      let bird;
      let pipes;
      let rebound;
      let gameOver = false;

      function preload() {
        this.load.image("bird", "src/assets/bird.png"); // Add your bird image path
        this.load.image("pipe", "src/assets/pipe.png"); // Add your pipe image path
        this.load.image("background", backgroundImage); // Load the background image
        this.load.image("rebound", reboundImage); // Load the rebound image
      }

      function create() {
        // Add background image and scale it to fit the game dimensions
        this.add
          .image(200, 300, "background")
          .setOrigin(0.5, 0.5)
          .setDisplaySize(400, 600); // Set width and height

        // Game creation logic
        bird = this.physics.add.sprite(100, 250, "bird");
        bird.setGravityY(500);
        bird.setCollideWorldBounds(true);

        // Add rebound
        rebound = this.physics.add.staticGroup();
        rebound.create(200, 580, 'rebound')
          .setDisplaySize(400, 50) // Set width to 400px and height to 50px
          .refreshBody(); // Refresh the physics body after resizing

        // Add keyboard input for space bar
        this.input.keyboard.on("keydown-SPACE", flap, this);

        pipes = this.physics.add.group();

        // Add pipes every 1.5 seconds
        this.time.addEvent({
          delay: 1500,
          callback: addPipe,
          callbackScope: this,
          loop: true,
        });

        // Increase score every 1.5 seconds
        this.time.addEvent({
          delay: 1500,
          callback: () => {
            if (!gameOver) {
              setScore((prevScore) => prevScore + 1);
            }
          },
          loop: true,
        });

        // Collision detection
        this.physics.add.collider(bird, pipes, hitPipe, null, this);
        this.physics.add.collider(bird, rebound, hitRebound, null, this);
        this.physics.add.collider(
          bird,
          this.physics.world.bounds,
          hitGround,
          null,
          this
        );
      }

      function update() {
        if (gameOver) return;

        // Remove off-screen pipes
        pipes.getChildren().forEach((pipe) => {
          if (pipe.x < -50) {
            pipes.remove(pipe, true, true);
          }
        });
      }

      function flap() {
        if (gameOver) return;
        bird.setVelocityY(-250);
      }

      function addPipe() {
        if (gameOver) return;

        const gap = 150;
        const pipeY = Phaser.Math.Between(100, 400);

        // Randomly choose between three pipe configurations
        const config = Phaser.Math.Between(0, 2);

        if (config === 0) {
          // Upper pipe
          const upperPipe = pipes.create(400, pipeY - gap, "pipe");
          upperPipe.setVelocityX(-200);
          upperPipe.setOrigin(0, 1);
          upperPipe.body.allowGravity = false;
        } else if (config === 1) {
          // Lower pipe
          const lowerPipe = pipes.create(400, pipeY, "pipe");
          lowerPipe.setVelocityX(-200);
          lowerPipe.setOrigin(0, 0);
          lowerPipe.body.allowGravity = false;
        } else if (config === 2) {
          // Gap between two pipes
          const upperPipe = pipes.create(400, pipeY - gap, "pipe");
          upperPipe.setVelocityX(-200);
          upperPipe.setOrigin(0, 1);
          upperPipe.body.allowGravity = false;

          const lowerPipe = pipes.create(400, pipeY, "pipe");
          lowerPipe.setVelocityX(-200);
          lowerPipe.setOrigin(0, 0);
          lowerPipe.body.allowGravity = false;
        }
      }

      function hitPipe() {
        if (!gameOver) {
          gameOver = true;
          this.physics.pause();
          updateHighestScore(score);
          setGameState("end");
        }
      }

      function hitRebound() {
        if (!gameOver) {
          gameOver = true;
          this.physics.pause();
          updateHighestScore(score);
          setGameState("end");
        }
      }

      function hitGround() {
        if (!gameOver && bird.y > 580) {
          gameOver = true;
          this.physics.pause();
          updateHighestScore(score);
          setGameState("end");
        }
      }

      function updateHighestScore(currentScore) {
        const storedHighestScore = parseInt(localStorage.getItem("highestScore")) || 0;
        if (currentScore > storedHighestScore) {
          localStorage.setItem("highestScore", currentScore);
          setHighestScore(currentScore);
        }
      }
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [gameState]);

  const handleStart = () => {
    setScore(0);
    setGameState("playing");
  };

  const handleRestart = () => {
    setScore(0);
    setGameState("playing");
  };

  return (
    <div>
      {gameState === "start" && <StartScreen onStart={handleStart} />}
      {gameState === "playing" && (
        <div id="game-container">
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "100px",
              color: "#fff",
              fontSize: "24px",
            }}
          >
            Score: {score}
          </div>
        </div>
      )}
      {gameState === "end" && (
        <EndScreen
          finalScore={score}
          highestScore={highestScore}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default FlappyBird;