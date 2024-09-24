const heroModel = require('../models/heroModel');   
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
router.get('/hero', async (req, res) => {
    try {
        const hero = await heroModel.find({});
        res.send(hero);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST route to update/create the hero section
router.post('/hero/edit', upload.single('imageUrl'), async (req, res) => {
    try {
        const { title, description, count1, description1, count2, description2} = req.body;

        // Find the first hero document
        let hero = await heroModel.findOne({});

        // If no document exists, create a new one
        if (!hero) {
            hero = new heroModel({
                title,
                description,
                imageUrl: req.file ? `uploads/${req.file.filename}` : '',
                count1,
                description1,
                count2,
                description2,
            });
        } else {
            // If the document exists, update the values
            hero.title = title;
            hero.description = description;

            // If a new image is uploaded, delete the old image and update
            if (req.file) {
                if (hero.imageUrl) {
                    const oldImagePath = path.join(__dirname, '..', hero.imageUrl);
                    fs.unlink(oldImagePath, (err) => {
                        if (err) {
                            console.error('Error deleting old image:', err);
                        }
                    });
                }
                hero.imageUrl = `uploads/${req.file.filename}`;
            }

            hero.count1 = count1;
            hero.description1 = description1;
            hero.count2 = count2;
            hero.description2 = description2;
        }

        // Save the document (either as a new one or an updated one)
        await hero.save();
        res.status(200).json({ message: 'Hero section saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;


