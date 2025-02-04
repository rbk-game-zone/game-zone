const db = require('../model/index'); // Assuming you have a Room model defined

// Create a new room
exports.createRoom = async (req, res) => {
    const { name, created_by } = req.body;
    const newRoom = await db.Room.create({ name, created_by });
    
    // Emit the new room to all connected clients
    req.io.emit('roomCreated', newRoom); // Notify all clients about the new room
    res.status(201).json(newRoom);
};

// Get all rooms
exports.getRooms = async (req, res) => {
    const rooms = await db.Room.findAll();
    res.status(200).json(rooms);
}; 