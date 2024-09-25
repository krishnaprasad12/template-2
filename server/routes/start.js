const startModel = require('../models/startModel');   
const express = require('express');
const router = express.Router();

// Get the value us page
router.get('/start', async (req, res) => {
    try {
        const start = await startModel.find({});
        res.send(start);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST route to update/create the start section
router.post('/start/edit', async (req, res) => {
    try {
        const { title, description, url } = req.body;

        // Find the first start document
        let start = await startModel.findOne({});

        // If no document exists, create a new one
        if (!start) {
            start = new startModel({
                title,
                description,
                url
            });
        } else {
            // If the document exists, update the values
            start.title = title;
            start.description = description;
            start.url = url;
        }

        // Save the document (either as a new one or an updated one)
        await start.save();
        res.status(200).json({ message: 'Start section saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;