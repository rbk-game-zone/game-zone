const { User } = require('../model/index');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');
const db = require('../model/index');
const nodemailer = require('nodemailer');
const { generateResetToken } = require('../utils/authUtils');


module.exports = {
    Login: async (req, res) => {
        try {
            const { email, username, password ,role,first_name,last_name,age,address,sexe} = req.body;

            // Check if either email or username is provided
            if ((!email && !username) || !password) {
                return res.status(400).json({ message: "Email/Username and password are required" });
            }

            // Find user by email or username
            const user = await User.findOne({
                where: {
                    [Op.or]: [
                        { email: email || null },
                        { username: username || null }
                    ]
                }
            });

            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const accessToken = jwt.sign(
                { 
                    userId: user.id,
                    role: user.role
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token: accessToken,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    fullName: `${user.first_name} ${user.last_name}`,
                    role: user.role,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    age: user.age,
                    address: user.address,
                    sexe: user.sexe
                }
            });


        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error logging in" });
        }
    },
    Register: async (req, res) => {
        try {
            const { 
                username, 
                email, 
                password, 
                first_name, 
                last_name, 
                age, 
                address, 
                sexe,
                role
            } = req.body;

            // Check for required fields
            if (!username || !email || !password || !first_name || !last_name || !age || !address || !sexe) {
                return res.status(400).json({ 
                    error: true, 
                    message: "All fields are required" 
                });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ 
                    error: true, 
                    message: "Email already registered" 
                });
            }

            // Hash password
            const hashPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                username,
                email: email.toLowerCase(),
                password: hashPassword,
                first_name,
                last_name,
                age,
                address,
                sexe,
                role: role || 'player'
            });

            // Generate JWT token
            const accessToken = jwt.sign(
                { 
                    userId: user.id,
                    role: user.role
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "72h" }
            );

            return res.status(201).json({
                error: false,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    first_name: user.first_name,
                    last_name: user.last_name
                },
                accessToken
            });

        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ 
                error: true, 
                message: "Error during registration" 
            });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: ['id', 'username', 'email', 'role','first_name','last_name','age','address','sexe'] // Select specific fields to return
            });
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: "Failed to retrieve users" });
        }
    },
    updateUser: async (req, res) => {
        const { id } = req.params;
        const { username, email, role, sexe } = req.body;
    
        try {
            // Validate required fields
            if (!username || !email) {
                return res.status(400).json({ message: "Username and email are required" });
            }
    
            // Check if the new username already exists (excluding the current user)
            if (username) {
                const existingUser = await User.findOne({ where: { username } });
                if (existingUser && existingUser.id !== parseInt(id)) {
                    return res.status(400).json({ message: "Username already exists" });
                }
            }
    
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            // Update only the provided fields
            if (username) user.username = username;
            if (email) user.email = email;
            if (role) user.role = role;
            if (sexe) user.sexe = sexe;
    
            await user.save();
            res.json({ message: "User updated successfully", user });
        } catch (error) {
            console.error('Update error:', error);
            res.status(500).json({ message: "Failed to update user", error: error.message });
        }
    },
    deleteUser: async (req, res) => {
        const { id } = req.params;

        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            await user.destroy();
            res.json({ message: "User deleted successfully" });
        } catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({ message: "Failed to delete user" });
        }
    },
    forgotPassword: async (req, res) => {
        const { email } = req.body;
    
        try {
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined in environment variables');
            }
    
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
            console.log("Reset URL:", resetUrl);  // Debugging
    
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
    
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset Request',
                html: `<p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>`,
            };
    
            await transporter.sendMail(mailOptions);
            res.json({ success: true, message: "Password reset link sent to email" });
    
        } catch (error) {
            console.error('Forgot Password Error:', error);
            res.status(500).json({ message: "Error processing request", error: error.message });
        }
    },
    resetPassword: async (req, res) => {
        const { token, newPassword } = req.body;

        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Update the password
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();

            res.json({ success: true, message: "Password reset successfully" });
        } catch (error) {
            console.error('Error resetting password:', error);
            res.status(400).json({ message: "Invalid or expired token" });
        }
    },
    changePassword: async (req, res) => {
        const { userId, currentPassword, newPassword } = req.body;

        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Verify the current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            res.json({ success: true, message: "Password updated successfully" });
        } catch (error) {
            console.error('Error changing password:', error);
            res.status(500).json({ message: "Error changing password", error: error.message });
        }
    }
}
