const db = require('../model');

module.exports = {
    createRoom: async (req, res) => {
        const { name, created_by } = req.body;
        try {
            const room = await db.Room.create({ name, created_by });
            res.status(201).json(room);
        } catch (error) {
            console.error('Error creating room:', error);
            res.status(500).json({ message: "Error creating room", error: error.message });
        }
    },

    joinRoom: async (req, res) => {
        const { user_id, room_id } = req.body;
        try {
            const userRoom = await db.UserRoom.create({ user_id, room_id });
            res.status(200).json(userRoom);
        } catch (error) {
            console.error('Error joining room:', error);
            res.status(500).json({ message: "Error joining room", error: error.message });
        }
    },

    getRooms: async (req, res) => {
        try {
            const rooms = await db.Room.findAll();
            res.status(200).json(rooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            res.status(500).json({ message: "Error fetching rooms", error: error.message });
        }
    },

    getMessagesByRoom: async (req, res) => {
        const { room_id } = req.params;
        try {
            const messages = await db.Message.findAll({
                where: { room_id },
                include: [
                    {
                        model: db.User,
                    },
                    {
                        model: db.Room,
                    }
                ]
            });
            res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ message: "Error fetching messages", error: error.message });
        }
    },

    postMessage: async (req, res) => {
        try {
            const { room_id, user_id, content } = req.body;
            const newMessage = await db.Message.create({ room_id, user_id, content });

            const messageWithUser = await db.Message.findOne({
                where: { id: newMessage.id },
                include: [{ model: db.User, attributes: ["username"] }],
            });

            res.status(201).json(messageWithUser);
        } catch (error) {
            res.status(500).json({ error: "Failed to post message", details: error.message });
        }
    }
}; 