  import type React from "react";
  import { useState, useEffect } from "react";

  const Game: React.FC = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [board, setBoard] = useState<string[][]>([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    const [currentPlayer, setCurrentPlayer] = useState<string>("X");
    const [isComputerTurn, setIsComputerTurn] = useState<boolean>(false);
    const [isMultiplayer, setIsMultiplayer] = useState<boolean>(false);
    const [isHomePage, setIsHomePage] = useState<boolean>(true);
    const [player1Name, setPlayer1Name] = useState<string>("player 1");
    const [player2Name, setPlayer2Name] = useState<string>("player 2");
    const [player1Score, setPlayer1Score] = useState<number>(0);
    const [player2Score, setPlayer2Score] = useState<number>(0);
    const [winnerMessage, setWinnerMessage] = useState<string>("");
    const [scoreToWin, setScoreToWin] = useState<number>(3);
    const [showPlayAgain, setShowPlayAgain] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);

    const startGame = () => {
      setIsHomePage(false);
      setGameStarted(true);
      setIsComputerTurn(false);
      setWinnerMessage("");
      setShowPlayAgain(false);
      resetBoard();
      setPlayer1Score(0);
      setPlayer2Score(0);
      setScore(0)
    };

    const resetGame = () => {
      setIsHomePage(true);
      setGameStarted(false);
      setIsComputerTurn(false);
      setWinnerMessage("");
      setShowPlayAgain(false);
      resetBoard();
    };

    const resetBoard = () => {
      setBoard([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ]);
      setCurrentPlayer("X");
      setWinnerMessage("");
      setIsComputerTurn(false);
    };

    const handleCellClick = (row: number, col: number) => {
      if (!board[row][col] && gameStarted && !winnerMessage) {
        const newBoard = [...board];
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);

        if (checkWinner(newBoard, currentPlayer)) {
          if (currentPlayer === "X") {
            setPlayer1Score(player1Score + 1);
            setWinnerMessage(`${player1Name} Wins!`);
            setScore(score + 1)
            if (!(score +1 === scoreToWin) ) {
              setTimeout(() => {
                resetBoard(); 
            }, 2000); 
            } 
          } else {
            setPlayer2Score(player2Score + 1);
            setWinnerMessage(`${player2Name} Wins!`);
            setScore(score + 1)
            if (!(score +1 === scoreToWin) ) {
              setTimeout(() => {
                resetBoard(); 
            }, 2000); 
            } 
          }

          if (score +1 === scoreToWin) {
            setShowPlayAgain(true);
            setScore(0)
            // setWinnerMessage(`${player1Score>player2Score? player1Name : player2Name} is the Final Winner!`);
            if(player1Score>player2Score){
              setWinnerMessage(`${player1Name} is the Final Winner!`)
            }else if(player1Score<player2Score){
              setWinnerMessage(`${player2Name} is the Final Winner!`)
            }
            // else if(player1Score===player2Score){
            //   setWinnerMessage("met3adlin")
            // }
          }
          return;
        }

        if (newBoard.every((row) => row.every((cell) => cell !== ""))) {
          setWinnerMessage("Game over !");
          setTimeout(() => {
            resetBoard();
        }, 2000); 
          setShowPlayAgain(true);
          return;
        }

        setCurrentPlayer(isMultiplayer ? (currentPlayer === "X" ? "O" : "X") : "O");
        setIsComputerTurn(isMultiplayer ? false : true);
      }
    };

    const checkWinner = (board: string[][], player: string) => {
      const winningCombinations = [
        [board[0][0], board[0][1], board[0][2]],
        [board[1][0], board[1][1], board[1][2]],
        [board[2][0], board[2][1], board[2][2]],
        [board[0][0], board[1][0], board[2][0]],
        [board[0][1], board[1][1], board[2][1]],
        [board[0][2], board[1][2], board[2][2]],
        [board[0][0], board[1][1], board[2][2]],
        [board[0][2], board[1][1], board[2][0]],
      ];

      return winningCombinations.some(
        (combination) => combination.every((cell) => cell === player)
      );
    };

    const computerMove = () => {
      const availableCells: [number, number][] = [];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (!board[row][col]) availableCells.push([row, col]);
        }
      }

      const randomMove = availableCells[Math.floor(Math.random() * availableCells.length)];
      if (randomMove) {
        const [row, col] = randomMove;
        const newBoard = [...board];
        newBoard[row][col] = "O";
        setBoard(newBoard);

        if (checkWinner(newBoard, "O")) {
          setPlayer2Score(player2Score + 1);
          setWinnerMessage(`${player2Name} Wins!`);
          if (player2Score + 1 === scoreToWin) {
            setWinnerMessage(`${player2Name} is the Final Winner!`);

          }
          setShowPlayAgain(true);
        } else if (newBoard.every((row) => row.every((cell) => cell !== ""))) {
          setWinnerMessage("Draw!");
          setShowPlayAgain(true);
        } else {
          setCurrentPlayer("X");
          setIsComputerTurn(false);
        }
      }
    };

    useEffect(() => {
      if (!isMultiplayer && isComputerTurn && gameStarted && !winnerMessage) {
        const timer = setTimeout(() => {
          computerMove();
        }, 500);
        return () => clearTimeout(timer);
      }
    }, [isComputerTurn, board, gameStarted, isMultiplayer, winnerMessage]);

    const styles = {
      container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        padding: "0",
        margin: "0",
        fontFamily: "'Arial', sans-serif",
      },
      homeContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        width: "100%",
        maxWidth: "500px",
        textAlign: "center",
      },
      title: {
        fontSize: "48px",
        color: "#fff",
        marginBottom: "30px",
        fontWeight: "bold",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
      },
      inputContainer: {
        marginBottom: "30px",
      },
      inputField: {
        width: "100%",
        padding: "15px 20px",
        margin: "10px 0",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "10px",
        color: "#fff",
        fontSize: "18px",
        transition: "all 0.3s ease",
        outline: "none",
      },
      label: {
        display: "block",
        color: "#fff",
        fontSize: "18px",
        textAlign: "left",
        marginBottom: "10px",
        opacity: "0.9",
      },
      buttonContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        marginTop: "30px",
        width: "100%",
        alignItems: "center",
      },
      button: {
        padding: "20px 30px",
        fontSize: "20px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "1px",
        color: "#fff",
        width: "100%",
        maxWidth: "300px",
      },
      vsComputerButton: {
        backgroundColor: "#4a90e2",
        "&:hover": {
          backgroundColor: "#357abd",
          transform: "translateY(-2px)",
        },
      },
      vsPlayerButton: {
        backgroundColor: "#50c878",
        "&:hover": {
          backgroundColor: "#3da75c",
          transform: "translateY(-2px)",
        },
      },
      gameContainer: {
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        padding: "20px",
      },
      scoreBoard: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: "600px",
        marginBottom: "30px",
        color: "#fff",
        fontSize: "24px",
        fontWeight: "bold",
      },
      board: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "15px",
        marginBottom: "30px",
      },
      cell: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "150px",
        height: "150px",
        backgroundColor: "#f8f9fa",
        borderRadius: "15px",
        fontSize: "48px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "#e9ecef",
        },
        color: "black",  // Ensures X and O are black
      },
      winnerMessage: {
        color: "#fff",
        fontSize: "32px",
        marginBottom: "30px",
        fontWeight: "bold",
      },
      resetButton: {
        backgroundColor: "#ff4d4d",
        "&:hover": {
          backgroundColor: "#cc0000",
          transform: "translateY(-2px)",
        },
      },
      playAgainButton: {
        backgroundColor: "#50c878",
        "&:hover": {
          backgroundColor: "#3da75c",
          transform: "translateY(-2px)",
        },
      },
    };

    return (
      <div style={styles.container}>
        <div style={styles.gameContainer}>
          {isHomePage ? (
            <div style={styles.homeContainer}>
              <h1 style={styles.title}>Tic-Tac-Toe</h1>
              <div>
                <input
                  type="text"
                  placeholder="enter Player 1 name..."
                  style={styles.inputField}
                
                  onChange={(e) => setPlayer1Name(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="enter Player 2 name..."
                  style={styles.inputField}
                  
                  onChange={(e) => setPlayer2Name(e.target.value)}
                />
                <div>
                  <label htmlFor="scoreToWin" style={styles.label}>
                    round
                  </label>
                  <input
                    id="scoreToWin"
                    type="number"
                    placeholder="Score to Win"
                    style={styles.inputField}
                    value={scoreToWin}
                    onChange={(e) => setScoreToWin(Number(e.target.value))}
                    min={1}
                  />
                </div>
              </div>
              <div style={styles.buttonContainer}>
                <button
                  onClick={() => {
                    setIsMultiplayer(false);
                    startGame();
                  }}
                  style={{ ...styles.button, ...styles.vsComputerButton }}
                >
                  vs comp
                </button>
                <button
                  onClick={() => {
                    setIsMultiplayer(true);
                    startGame();
                  }}
                  style={{ ...styles.button, ...styles.vsPlayerButton }}
                >
                  2 player
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={styles.scoreBoard}>
                <p>
                  {player1Name} (X): {player1Score}
                </p>
                <p>
                  {player2Name} (O): {player2Score}
                </p>
              </div>

              <div style={styles.board}>
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      style={{
                        ...styles.cell,
                        cursor: cell || winnerMessage ? "not-allowed" : "pointer",
                        backgroundColor: cell ? "#e9ecef" : "#f8f9fa",
                      }}
                    >
                      {cell}
                    </div>
                  ))
                )}
              </div>
              {winnerMessage && <div style={styles.winnerMessage}>{winnerMessage}</div>}
              <div style={styles.buttonContainer}>
                {showPlayAgain && (player1Score === scoreToWin || player2Score === scoreToWin) && (
                  <button
                    onClick={startGame}
                    style={{ ...styles.button, ...styles.playAgainButton }}
                  >
                    Play Again
                  </button>
                )}
                </div>
              <div style={styles.buttonContainer}>
                <button onClick={resetBoard} style={styles.button}>
                  Reset Board
                </button>
                <button
                  onClick={resetGame}
                  style={{ ...styles.button, ...styles.vsComputerButton }}
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default Game;
