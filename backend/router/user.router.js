const express = require("express");
const router = express.Router();
const { Login, Register, getAllUsers , updateUser, deleteUser, forgotPassword,resetPassword,changePassword} = require("../controllers/user.controller");
const authMiddleware = require('../middleware/authMiddleware');
router.post('/login', Login);
router.post('/register', Register);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);
router.post('/change-password',changePassword);

module.exports = router;

