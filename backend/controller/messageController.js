const db = require('../model/index'); // Assuming you have a Message model defined

// Send a message
exports.sendMessage = async (req, res) => {
    const { room_Id, user_Id, content } = req.body;
    const message = { room_Id, user_Id, content };
    
    // Save message to the database
    const newMessage = await db.Message.create(message);
    
    // Emit the message to the room using Socket.io
    req.io.to(room_Id).emit('newMessage', newMessage); // Emit to all users in the room
    res.status(200).json(newMessage);
};

// Get messages for a specific room
exports.getMessages = async (req, res) => {
    const { roomId } = req.params;
    
    // Fetch messages from the database
    const messages = await db.Message.findAll({ where: { roomId } });
    res.status(200).json(messages);
}; 