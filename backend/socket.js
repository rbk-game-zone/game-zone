const db = require("./model");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User joins a room
    socket.on("joinRoom", (data) => {
      if (!data || !data.user_id || !data.room_id) {
        console.error("Invalid data received for joinRoom:", data);
        return; // Exit if data is invalid
      }

      const { user_id, room_id } = data; // Now it's safe to destructure
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
      console.log("Message sent by user:", user_id, "Content:", content);
      try {
        const message = await db.Message.create({ user_id, room_id, content });
        io.to(room_id).emit("newMessage", message);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // Signal for WebRTC
    socket.on("signal", (data) => {
      socket.to(data.roomId).emit("signal", {
        signal: data.signal,
        id: socket.id,
      });
    });

    // Disconnecting user
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
