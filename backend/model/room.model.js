const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Room = sequelize.define("Room", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
   
  });

  return Room;
};
