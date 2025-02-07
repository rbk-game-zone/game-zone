const { Sequelize, DataTypes } = require("sequelize");
// Import dotenv to load environment variables
require('dotenv').config();

// Create Sequelize connection
const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: "mysql",
});

const db = {};
db.sequelize = sequelize;

// Import models
db.User = require("./user.model.js")(sequelize);
db.Game = require("./game.model.js")(sequelize);
db.Score = require("./score.model.js")(sequelize);
db.Message = require("./message.model.js")(sequelize);
db.Room = require("./room.model.js")(sequelize);
db.UserRoom = require("./user_room.model.js")(sequelize);

// Set up relationships
db.User.hasMany(db.Score, { foreignKey: 'user_id' });
db.Score.belongsTo(db.User, { foreignKey: 'user_id' });

db.Game.hasMany(db.Score, { foreignKey: 'game_id' });
db.Score.belongsTo(db.Game, { foreignKey: 'game_id' });

// Chat relationships
db.User.hasMany(db.Message, { foreignKey: 'user_id' });
db.Message.belongsTo(db.User, { foreignKey: 'user_id' });

db.Room.hasMany(db.Message, { foreignKey: 'room_id' });
db.Message.belongsTo(db.Room, { foreignKey: 'room_id' });

// Update room-user relationships
db.User.belongsToMany(db.Room, { through: db.UserRoom, foreignKey: 'user_id' });
db.Room.belongsToMany(db.User, { through: db.UserRoom, foreignKey: 'room_id' });

<<<<<<< HEAD
// db.sequelize.sync({ force: false , alter: false } )
=======
// db.sequelize.sync({ force: true  } )
>>>>>>> 8b5cf8ea10c6c53797a4612ac635287fd7e155a5
//   .then(() => {
//     console.log('Database synchronized');
//   })
//   .catch((err) => {
//     console.error('Error synchronizing database:', err);
//   });

module.exports = db;