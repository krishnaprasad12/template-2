const valueModel = require('../models/valueModel');   
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

// Get the value us page
router.get('/values', async (req, res) => {
    try {
        const value = await valueModel.find({});
        res.send(value);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update the value us page for the 0th index with image upload
router.post('/values/edit', upload.single('imageUrl'), async (req, res) => {
    try {
        const { heading, title, description, subheading1, description1, subheading2, description2, subheading3, description3 } = req.body;

        // Find the document at index 0 (assuming only one document should exist)
        let value = await valueModel.findOne({});

        // If no document exists, create a new one
        if (!value) {
            value = new valueModel({
                heading,
                title,
                description,
                imageUrl: req.file ? `uploads/${req.file.filename}` : '', // Use the uploaded file if available
                subheading1,
                description1,
                subheading2,
                description2,
                subheading3,
                description3
            });
        } else {
            // If the document exists, update the values
            value.heading = heading;
            value.title = title;
            value.description = description;

            // If a new image is uploaded, delete the old image and update
            if (req.file) {
                if (value.imageUrl) {
                    const oldImagePath = path.join(__dirname, '..', value.imageUrl);
                    fs.unlink(oldImagePath, (err) => {
                        if (err) {
                            console.error('Error deleting old image:', err);
                        }
                    });
                }
                value.imageUrl = `uploads/${req.file.filename}`;
            }

            value.subheading1 = subheading1;
            value.description1 = description1;
            value.subheading2 = subheading2;
            value.description2 = description2;
            value.subheading3 = subheading3;
            value.description3 = description3;
        }

        // Save the document (either as a new one or an updated one)
        await value.save();
        res.status(200).json({ message: 'Value saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
