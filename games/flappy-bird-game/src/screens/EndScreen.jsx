import React, { useState, useEffect } from "react";
import background from "../assets/background-day.png";

const EndScreen = ({ finalScore, onRestart }) => {
  const [high, setHigh] = useState(0);

  // Load the highest score from localStorage on component mount
  useEffect(() => {
    const storedHighScore = parseInt(localStorage.getItem("highestScoreflappy")) || 0;
    setHigh(storedHighScore);
  }, []);

  // Update the highest score if the finalScore is greater
  useEffect(() => {
    if (finalScore > high) {
      setHigh(finalScore);
      localStorage.setItem("highestScoreflappy", finalScore); // Update localStorage
    }
    
  }, [finalScore, high]); // Run only when finalScore or high changes

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        fontSize: "32px",
      }}
    >
      <div>Final Score: {finalScore}</div>
      <div>Highest Score: {high}</div>
      <div
        style={{
          marginTop: "20px",
          color: "#0f0",
          cursor: "pointer",
        }}
        onClick={onRestart}
      >
        Play Again
      </div>
    </div>
  );
};

export default EndScreen;