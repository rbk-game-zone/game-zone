const db = require('../model/index'); // Assuming you have a UserRoom model defined

// Add a user to a room
exports.addUserToRoom = async (req, res) => {
    const { userId, roomId } = req.body;
    await db.UserRoom.create({ user_id: userId, room_id: roomId });
    
    // Emit to the room that a user has joined
    req.io.to(roomId).emit('userJoined', { userId }); // Notify room members
    res.status(200).json({ message: 'User added to room' });
};

// Remove a user from a room
exports.removeUserFromRoom = async (req, res) => {
    const { userId, roomId } = req.body;
    await db.UserRoom.destroy({ where: { user_id: userId, room_id: roomId } });
    
    // Emit to the room that a user has left
    req.io.to(roomId).emit('userLeft', { userId }); // Notify room members
    res.status(200).json({ message: 'User removed from room' });
}; 