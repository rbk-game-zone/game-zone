const express = require("express");
const router = express.Router();
const { Login, Register } = require("../controllers/user.controller");

router.post('/login', Login);
router.post('/register', Register);

module.exports = router;

