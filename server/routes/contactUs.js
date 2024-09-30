const contactModel = require('../models/contactUsModel');   
const multer = require('multer');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const adminRoute = require('./admin')
const { authenticateAdmin } = adminRoute;

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
router.post('/contactus/edit', authenticateAdmin, upload.single('imageUrl'), async (req, res) => {
    try {
        const { title, description, call, message, chat, videocall } = req.body;

        // Find the document (assuming only one document should exist)
        let contact = await contactModel.findOne({});

        // Define the fixed image name
        const fixedImageName = 'contactimage.jpg'; // Fixed name for the image

        if (!contact) {
            // If no document exists, create a new one
            contact = new contactModel({
                title,
                description,
                call,
                message,
                chat,
                videocall,
                imageUrl: req.file ? `uploads/${fixedImageName}` : '', // Use the uploaded file if available
            });
        } else {
            // If the document exists, update the values
            contact.title = title;
            contact.description = description;
            contact.call = call;
            contact.message = message;
            contact.chat = chat;
            contact.videocall = videocall;

            // If a new image is uploaded, replace the old image with the fixed image name
            if (req.file) {
                const imagePath = path.join(__dirname, '..', 'uploads', fixedImageName);

                // Delete the old image if it exists
                if (fs.existsSync(imagePath)) {
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error('Error deleting old image:', err);
                        }
                    });
                }

                // Rename the new image to the fixed image name
                fs.rename(req.file.path, imagePath, (err) => {
                    if (err) {
                        console.error('Error renaming new image:', err);
                    }
                });

                contact.imageUrl = `uploads/${fixedImageName}`; // Save the path with the fixed image name
            }
        }

        // Save the document (either as a new one or an updated one)
        await contact.save();
        res.status(200).json({ message: 'Contact section saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
