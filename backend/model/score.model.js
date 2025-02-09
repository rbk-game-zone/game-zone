const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Score = sequelize.define("Score", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'game_id'] // Ensure unique score per user and game
      }
    ]
  });

  return Score;
};
