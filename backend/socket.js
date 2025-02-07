const db = require("./model");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User joins a room
    socket.on("joinRoom", async ({ user_id, room_id }) => {
      socket.join(room_id);
      console.log(`User ${user_id} joined room ${room_id}`);
    });

    // Create room
    socket.on("createRoom", async ({ name, created_by }) => {
      try {
        const room = await db.Room.create({ name, created_by });
        io.emit("roomCreated", room); // Notify all clients about the new room
      } catch (error) {
        console.error("Error creating room:", error);
      }
    });

    // Sending a message
    socket.on("sendMessage", async ({ user_id, room_id, content }) => {
      try {
        const message = await db.Message.create({ user_id, room_id, content });
        io.to(room_id).emit("newMessage", message);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // Disconnecting user
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
