const express =  require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // JWT for token-based authentication
const adminModel = require('../models/adminModel');
const router = express.Router();


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Store this in an environment variable for security


// Route to create a new admin user

router.post('/admin', async (req, res) => {
    const { username, password } = req.body; // Accessing body

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

        const newAdmin = new adminModel({
            username,
            password: hashedPassword,
        });

        await newAdmin.save();
        res.status(201).json({ message: "Admin registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to log in as admin
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        const admin = await adminModel.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token for the admin
        const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, {
            expiresIn: '30m', // Token expiration time
        });

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get all admins (for demonstration purposes)
router.get('/admins', async (req, res) => {
    try {
        const admins = await adminModel.find({});
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware to authenticate admin using JWT
const authenticateAdmin = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "No token provided, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
        req.admin = decoded; // Add admin details to request object
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Protected route example - only admins can access
router.get('/protected', authenticateAdmin, (req, res) => {
    console.log(req.admin); // Access admin details from request object
    res.json({ message: "This is a protected route accessible only by admins" });
});

router.authenticateAdmin = authenticateAdmin;
module.exports = router;


