const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Game = sequelize.define("Game", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    game_file: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });

  return Game;
};
