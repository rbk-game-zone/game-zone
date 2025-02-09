// src/screens/StartScreen.js
import React from "react";
import background from "../assets/background-day.png"; // Make sure the path is correct

const StartScreen = ({ onStart }) => {

  
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        fontSize: "32px",
        cursor: "pointer",
      }}
      onClick={onStart}
    >
      Click to Start
    </div>
  );
};

export default StartScreen;
