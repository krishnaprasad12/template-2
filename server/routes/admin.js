const express =  require('express');
const bcrypt = require('bcrypt');
const adminModel = require('../models/adminModel');
const router = express.Router();

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

// Route to get all admins (for demonstration purposes)
router.get('/admins', async (req, res) => {
    try {
        const admins = await adminModel.find({});
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;


