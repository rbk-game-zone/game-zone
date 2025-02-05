const express = require("express");
const router = express.Router();
const chatController = require("../controller/chat.controller");

router.get("/room/:room_id/messages", chatController.getRoomMessages);
router.post("/room/:room_id/messages", chatController.postMessage);

module.exports = router;
