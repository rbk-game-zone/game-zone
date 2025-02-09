const db = require("../model/index");

exports.getRoomMessages = async (req, res) => {
  try {
    const { room_id } = req.params;
    const messages = await db.Message.findAll({
      where: { room_id },
      include: [{ model: db.User, attributes: ["username"] }],
      order: [["id", "ASC"]],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { room_id, user_id, content } = req.body; // Assuming user_id is sent with the message
    const newMessage = await db.Message.create({ room_id, user_id, content });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to post message", details: error.message });
  }
};
