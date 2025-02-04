const { User } = require('../model/index');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');
const db = require('../model/index');


module.exports = {
    Login: async (req, res) => {
        try {
            const { email, username, password } = req.body;

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
    }
}
