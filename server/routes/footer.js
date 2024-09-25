const footerModel = require('../models/footerModel');   
const express = require('express');
const router = express.Router();

// Get the footer page
router.get('/footer', async (req, res) => {
    try {
        const footer = await footerModel.find({});
        res.send(footer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST route to update/create the footer section
router.post('/footer/edit', async (req, res) => {
    try {
        const { description, address } = req.body;

        // Find the first footer document
        let footer = await footerModel.findOne({});

        // If no document exists, create a new one
        if (!footer) {
            footer = new footerModel({
                description,
                address
            });
        } else {
            // If the document exists, update the values
            footer.description = description;
            footer.address = address;
        }

        // Save the document (either as a new one or an updated one)
        await footer.save();
        res.status(200).json({ message: 'Footer section saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;