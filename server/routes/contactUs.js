const contactModel = require('../models/contactUsModel');   
const multer = require('multer');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage }); // Create a multer instance

// Get the contact us page
router.get('/contactus', async (req, res) => {
    try {
        const contact = await contactModel.find({});
        res.send(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update the contact us page for the 0th index with image upload
router.post('/contactus/edit', upload.single('imageUrl'), async (req, res) => {
    try {
        const { title, description, call, message, chat, videocall } = req.body;

        // Find the document at index 0 (assuming only one document should exist)
        let contact = await contactModel.findOne({});

        // If no document exists, create a new one
        if (!contact) {
            contact = new contactModel({
                title,
                description,
                call,
                message,
                chat,
                videocall,
                imageUrl: req.file ? `uploads/${req.file.filename}` : '', // Use the uploaded file if available
            });
        } else {
            // If the document exists, update the values
            contact.title = title;
            contact.description = description;
            contact.call = call;
            contact.message = message;
            contact.chat = chat;
            contact.videocall = videocall;

            // If a new image is uploaded, delete the old image and update
            if (req.file) {
                if (contact.imageUrl) {
                    const oldImagePath = path.join(__dirname, '..', contact.imageUrl);
                    fs.unlink(oldImagePath, (err) => {
                        if (err) {
                            console.error('Error deleting old image:', err);
                        }
                    });
                }
                contact.imageUrl = `uploads/${req.file.filename}`;
            }
        }

        // Save the document (either as a new one or an updated one)
        await contact.save();
        res.status(200).json({ message: 'Contact saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
