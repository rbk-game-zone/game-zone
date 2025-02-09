import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";

const MemoryGame = () => {
  const gameContainer = useRef<HTMLDivElement>(null);
  const [rounds, setRounds] = useState(1);

  useEffect(() => {
    class StartScene extends Phaser.Scene {
      constructor() {
        super("StartScene");
      }

      create() {
        // Create animated background
        const particles = this.add.particles(0, 0, "spark", {
          speed: 100,
          scale: { start: 1, end: 0 },
          blendMode: "ADD",
          emitting: false,
        });

        // Create gradient background
        const gradient = this.add.graphics();
        gradient.fillGradientStyle(0x1e1b4b, 0x4c1d95, 0x831843, 0x1e1b4b, 1);
        gradient.fillRect(0, 0, this.scale.width, this.scale.height);

        // Animated orbs
        for (let i = 0; i < 3; i++) {
          const x = Phaser.Math.Between(0, this.scale.width);
          const y = Phaser.Math.Between(0, this.scale.height);
          const orb = this.add.circle(x, y, 150, 0x6366f1, 0.2);
          this.tweens.add({
            targets: orb,
            x: "+=100",
            y: "+=100",
            scale: 1.2,
            duration: 7000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
            delay: i * 2000,
          });
        }

        // Title with gradient and shadow
        const title = this.add
          .text(this.scale.width / 2, 100, "Memory Game", {
            fontSize: "64px",
            fontFamily: "Arial",
            color: "#fff",
          })
          .setOrigin(0.5);

        title.setStroke("#6366f1", 8);
        title.setShadow(2, 2, "#000000", 2, true, true);

        // Player name inputs
        this.player1Name = "Player 1";
        this.player2Name = "Player 2";

        // Player 1 input
        this.player1Input = this.add
          .text(this.scale.width / 2 - 110, 180, this.player1Name, {
            fontSize: "24px",
            fontFamily: "Arial",
            color: "#fff",
            backgroundColor: "#4c1d95",
            padding: { x: 10, y: 5 },
          })
          .setOrigin(0.5)
          .setInteractive();

        // Player 2 input
        this.player2Input = this.add
          .text(this.scale.width / 2 + 110, 180, this.player2Name, {
            fontSize: "24px",
            fontFamily: "Arial",
            color: "#fff",
            backgroundColor: "#4c1d95",
            padding: { x: 10, y: 5 },
          })
          .setOrigin(0.5)
          .setInteractive();

        // Add edit functionality to player name inputs
        this.makeEditable(this.player1Input, (newName) => {
          this.player1Name = newName || "Player 1";
        });

        this.makeEditable(this.player2Input, (newName) => {
          this.player2Name = newName || "Player 2";
        });

        // Stylish start button
        const startButton = this.add.container(this.scale.width / 2, 250);

        const buttonBg = this.add.rectangle(0, 0, 200, 60, 0x6366f1).setInteractive().setOrigin(0.5);

        const buttonText = this.add
          .text(0, 0, "Start Game", {
            fontSize: "28px",
            fontFamily: "Arial",
            color: "#ffffff",
          })
          .setOrigin(0.5);

        startButton.add([buttonBg, buttonText]);

        // Button hover effects
        buttonBg.on("pointerover", () => {
          buttonBg.setFillStyle(0x818cf8);
          particles.emitting = true;
          this.tweens.add({
            targets: startButton,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 100,
          });
        });

        buttonBg.on("pointerout", () => {
          buttonBg.setFillStyle(0x6366f1);
          particles.emitting = false;
          this.tweens.add({
            targets: startButton,
            scaleX: 1,
            scaleY: 1,
            duration: 100,
          });
        });

        buttonBg.on("pointerdown", () => {
          this.scene.start("MemoryScene", {
            // rounds: this.rounds,
            player1Name: this.player1Name,
            player2Name: this.player2Name,
          });
        });
      }

      makeEditable(textObject, onUpdate) {
        textObject.on("pointerdown", () => {
          const input = document.createElement("input");
          input.type = "text";
          input.value = textObject.text;
          input.style.position = "absolute";
          input.style.left = `${textObject.x - textObject.width / 2}px`;
          input.style.top = `${textObject.y - textObject.height / 2}px`;
          input.style.width = `${textObject.width}px`;
          input.style.fontSize = "24px";
          input.style.fontFamily = "Arial";
          input.style.color = "#000";
          input.style.backgroundColor = "#fff";
          input.style.border = "none";
          input.style.borderRadius = "4px";
          input.style.padding = "4px";
          input.style.textAlign = "center";

          document.body.appendChild(input);
          input.focus();

          const updateName = () => {
            const newName = input.value.trim();
            textObject.setText(newName || textObject.text);
            onUpdate(newName);
            document.body.removeChild(input);
          };

          input.addEventListener("blur", updateName);
          input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              updateName();
            }
          });
        });
      }
    }

    class MemoryScene extends Phaser.Scene {
      constructor() {
        super("MemoryScene");
      }

      init(data) {
        // this.rounds = data.rounds;
        this.playerTurn = 1;
        this.scores = { 1: 0, 2: 0 };
        this.player1Name = data.player1Name;
        this.player2Name = data.player2Name;
      }

      create() {
        // Create gradient background
        const gradient = this.add.graphics();
        gradient.fillGradientStyle(0x1e1b4b, 0x4c1d95, 0x831843, 0x1e1b4b, 1);
        gradient.fillRect(0, 0, this.scale.width, this.scale.height);

        // Animated orbs
        for (let i = 0; i < 3; i++) {
          const x = Phaser.Math.Between(0, this.scale.width);
          const y = Phaser.Math.Between(0, this.scale.height);
          const orb = this.add.circle(x, y, 150, 0x6366f1, 0.2);
          this.tweens.add({
            targets: orb,
            x: "+=100",
            y: "+=100",
            scale: 1.2,
            duration: 7000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
            delay: i * 2000,
          });
        }

        // Game info panel with gradient background
        const infoPanelBg = this.add.rectangle(0, 0, this.scale.width, 120, 0x000000, 0.3).setOrigin(0);

        // Round text on the left
        // this.add
        //   .text(20, 20, `Round: 1/${this.rounds}`, {
        //     fontSize: "24px",
        //     fontFamily: "Arial",
        //     color: "#fff",
        //   })
        //   .setShadow(1, 1, "#000000", 1);

        // Turn text in the center
        this.turnText = this.add
          .text(this.scale.width / 2, 20, `${this.player1Name}'s Turn`, {
            fontSize: "24px",
            fontFamily: "Arial",
            color: "#fff",
          })
          .setOrigin(0.5)
          .setShadow(1, 1, "#000000", 1);

        // Player name and score text
        this.player1NameText = this.add
          .text(20, 50, this.player1Name, {
            fontSize: "24px",
            fontFamily: "Arial",
            color: "#fff",
          })
          .setShadow(1, 1, "#000000", 1);

        this.player1ScoreText = this.add
          .text(20, 80, `Score: 0`, {
            fontSize: "20px",
            fontFamily: "Arial",
            color: "#fff",
          })
          .setShadow(1, 1, "#000000", 1);

        this.player2NameText = this.add
          .text(this.scale.width - 20, 50, this.player2Name, {
            fontSize: "24px",
            fontFamily: "Arial",
            color: "#fff",
            align: "right",
          })
          .setOrigin(1, 0)
          .setShadow(1, 1, "#000000", 1);

        this.player2ScoreText = this.add
          .text(this.scale.width - 20, 80, `Score: 0`, {
            fontSize: "20px",
            fontFamily: "Arial",
            color: "#fff",
            align: "right",
          })
          .setOrigin(1, 0)
          .setShadow(1, 1, "#000000", 1);

        // Add edit buttons for player names
        this.addEditButton(this.player1NameText, 1);
        this.addEditButton(this.player2NameText, 2);

        this.setupBoard();

        // Styled back button
        const backButton = this.add.container(100, this.scale.height - 50);

        const backBg = this.add.rectangle(0, 0, 120, 40, 0xef4444).setInteractive().setOrigin(0.5);

        const backText = this.add
          .text(0, 0, "Back", {
            fontSize: "20px",
            fontFamily: "Arial",
            color: "#ffffff",
          })
          .setOrigin(0.5);

        backButton.add([backBg, backText]);

        // Back button hover effects
        backBg.on("pointerover", () => {
          backBg.setFillStyle(0xf87171);
          this.tweens.add({
            targets: backButton,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 100,
          });
        });

        backBg.on("pointerout", () => {
          backBg.setFillStyle(0xef4444);
          this.tweens.add({
            targets: backButton,
            scaleX: 1,
            scaleY: 1,
            duration: 100,
          });
        });

        backBg.on("pointerdown", () => this.scene.start("StartScene"));
      }

      addEditButton(nameText, playerNumber) {
        const editButton = this.add
          .text(nameText.x + nameText.width + 10, nameText.y, "✏️", {
            fontSize: "20px",
            fontFamily: "Arial",
          })
          .setInteractive();

        editButton.on("pointerdown", () => {
          const input = document.createElement("input");
          input.type = "text";
          input.value = playerNumber === 1 ? this.player1Name : this.player2Name;
          input.style.position = "absolute";
          input.style.left = `${nameText.x}px`;
          input.style.top = `${nameText.y}px`;
          input.style.width = `${nameText.width}px`;
          input.style.fontSize = "24px";
          input.style.fontFamily = "Arial";
          input.style.color = "#000";
          input.style.backgroundColor = "#fff";
          input.style.border = "none";
          input.style.borderRadius = "4px";
          input.style.padding = "4px";

          document.body.appendChild(input);
          input.focus();

          const updateName = () => {
            const newName = input.value.trim() || (playerNumber === 1 ? "Player 1" : "Player 2");
            if (playerNumber === 1) {
              this.player1Name = newName;
              this.player1NameText.setText(newName);
            } else {
              this.player2Name = newName;
              this.player2NameText.setText(newName);
            }
            editButton.x = nameText.x + nameText.width + 10;
            document.body.removeChild(input);
            this.updateTurnText();
          };

          input.addEventListener("blur", updateName);
          input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              updateName();
            }
          });
        });
      }

      updateTurnText() {
        const currentPlayerName = this.playerTurn === 1 ? this.player1Name : this.player2Name;
        this.turnText.setText(`${currentPlayerName}'s Turn`);
      }

      setupBoard() {
        const symbols = ["🔥", "🌊", "🌿", "⚡", "🌍", "🌙", "☀️", "❄️"];
        this.cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
        this.selected = [];
        this.matched = 0;
        this.canInteract = false;

        // Define the number of rows and columns
        const rows = 4;
        const cols = 4;

        // Calculate card size and spacing
        const cardWidth = 100; // Width of each card
        const cardHeight = 100; // Height of each card
        const spacing = 20; // Space between cards

        // Calculate the total width and height of the board
        const boardWidth = cols * cardWidth + (cols - 1) * spacing;
        const boardHeight = rows * cardHeight + (rows - 1) * spacing;

        // Calculate the starting position to center the board
        const startX = (this.scale.width - boardWidth) / 2;
        const startY = (this.scale.height - boardHeight) / 2 + 120; // Add 120 to account for the info panel

        this.cardObjects = this.cards.map((symbol, index) => {
          // Calculate the row and column for the current card
          const row = Math.floor(index / cols);
          const col = index % cols;

          // Calculate the x and y position for the current card
          const x = startX + col * (cardWidth + spacing);
          const y = startY + row * (cardHeight + spacing);

          // Create a container for the card
          const container = this.add.container(x, y);

          // Outer glow effect
          const glow = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x6366f1, 0.2).setOrigin(0.5);

          // Card background with gradient
          const cardBg = this.add
            .rectangle(0, 0, cardWidth - 10, cardHeight - 10, 0xffffff)
            .setInteractive()
            .setOrigin(0.5);

          // Inner shadow effect
          const innerShadow = this.add.rectangle(2, 2, cardWidth - 14, cardHeight - 14, 0x000000, 0.1).setOrigin(0.5);

          // Card text (symbol)
          const text = this.add
            .text(0, 0, symbol, {
              fontSize: "40px",
              color: "#1f2937",
            })
            .setOrigin(0.5);

          container.add([glow, cardBg, innerShadow, text]);

          // Enhanced card hover effects
          cardBg.on("pointerover", () => {
            if (this.canInteract && text.text === "?") {
              this.tweens.add({
                targets: [container, glow],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: "Back.easeOut",
              });
              this.tweens.add({
                targets: glow,
                alpha: 0.4,
                duration: 200,
              });
            }
          });

          cardBg.on("pointerout", () => {
            this.tweens.add({
              targets: [container, glow],
              scaleX: 1,
              scaleY: 1,
              duration: 200,
              ease: "Back.easeIn",
            });
            this.tweens.add({
              targets: glow,
              alpha: 0.2,
              duration: 200,
            });
          });

          cardBg.on("pointerdown", () => this.handleCardClick(index));

          return { container, text, glow, cardBg };
        });

        // Enhanced initial card reveal animation
        setTimeout(() => {
          this.cardObjects.forEach(({ container, text, cardBg }, index) => {
            this.tweens.add({
              targets: container,
              scaleX: 0,
              duration: 300,
              delay: index * 50,
              ease: "Back.easeIn",
              onComplete: () => {
                text.setText("?");
                cardBg.setFillStyle(0xf3f4f6);
                this.tweens.add({
                  targets: container,
                  scaleX: 1,
                  duration: 300,
                  ease: "Back.easeOut",
                });
              },
            });
          });
          this.canInteract = true;
        }, 2000);
      }

      handleCardClick(index) {
        if (!this.canInteract || this.selected.length >= 2 || this.cardObjects[index].text.text !== "?") return;

        const { container, text, glow } = this.cardObjects[index];

        // Enhanced flip animation with rotation and scaling
        this.tweens.add({
          targets: container,
          scaleX: 0,
          duration: 200,
          ease: "Back.easeIn",
          onComplete: () => {
            text.setText(this.cards[index]);
            this.tweens.add({
              targets: container,
              scaleX: 1,
              duration: 200,
              ease: "Back.easeOut",
            });
          },
        });

        // Glow effect when card is selected
        this.tweens.add({
          targets: glow,
          alpha: 0.4,
          duration: 200,
        });

        this.selected.push(index);

        if (this.selected.length === 2) {
          this.canInteract = false;
          setTimeout(() => {
            if (this.cards[this.selected[0]] === this.cards[this.selected[1]]) {
              this.matched++;
              this.scores[this.playerTurn]++;

              // Update player scores
              this.player1ScoreText.setText(`Score: ${this.scores[1]}`);
              this.player2ScoreText.setText(`Score: ${this.scores[2]}`);

              // Enhanced match animation
              this.selected.forEach((idx) => {
                const { container, glow } = this.cardObjects[idx];
                // Celebration animation
                this.tweens.add({
                  targets: container,
                  y: container.y - 20,
                  scaleX: 1.2,
                  scaleY: 1.2,
                  duration: 300,
                  yoyo: true,
                  ease: "Back.easeInOut",
                  onComplete: () => {
                    // Subtle floating animation for matched cards
                    this.tweens.add({
                      targets: container,
                      y: container.y - 5,
                      duration: 1000,
                      yoyo: true,
                      repeat: -1,
                      ease: "Sine.easeInOut",
                    });
                  },
                });
                // Enhance glow for matched cards
                this.tweens.add({
                  targets: glow,
                  alpha: 0.6,
                  duration: 300,
                });
              });
            } else {
              // Enhanced flip back animation
              this.selected.forEach((idx) => {
                const { container, text, glow } = this.cardObjects[idx];
                this.tweens.add({
                  targets: container,
                  scaleX: 0,
                  duration: 200,
                  ease: "Back.easeIn",
                  onComplete: () => {
                    text.setText("?");
                    this.tweens.add({
                      targets: container,
                      scaleX: 1,
                      duration: 200,
                      ease: "Back.easeOut",
                    });
                  },
                });
                // Reset glow
                this.tweens.add({
                  targets: glow,
                  alpha: 0.2,
                  duration: 200,
                });
              });

              this.playerTurn = this.playerTurn === 1 ? 2 : 1;
              this.updateTurnText();
            }
            this.selected = [];
            this.canInteract = true;
          }, 1000);
        }
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: gameContainer.current!,
      scene: [StartScene, MemoryScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      backgroundColor: 0x000000,
    };

    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, [rounds]);

  return (
    <div
      ref={gameContainer}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden", // Prevent scrolling
        margin: 0,
        padding: 0,
      }}
    />
  );
};

export default MemoryGame;