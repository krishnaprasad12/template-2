const heroModel = require('../models/heroModel');   
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
router.post('/hero/edit', authenticateAdmin, upload.single('imageUrl'), async (req, res) => {
    try {
        const { title, description, count1, description1, count2, description2 } = req.body;

        // Find the first hero document
        let hero = await heroModel.findOne({});

        // Define the fixed image name
        const fixedImageName = 'heroimage.jpg'; // You can change the extension to whatever the uploaded file type is

        if (!hero) {
            // If no document exists, create a new one
            hero = new heroModel({
                title,
                description,
                imageUrl: req.file ? `uploads/${fixedImageName}` : '',
                count1,
                description1,
                count2,
                description2,
            });
        } else {
            // If the document exists, update the values
            hero.title = title;
            hero.description = description;

            // If a new image is uploaded, overwrite the existing hero image
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

                // Move the new image with the fixed name
                fs.rename(req.file.path, imagePath, (err) => {
                    if (err) {
                        console.error('Error renaming new image:', err);
                    }
                });

                hero.imageUrl = `uploads/${fixedImageName}`;
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


