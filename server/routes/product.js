const productModel = require('../models/productModel');   
const multer = require('multer');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Correctly set the destination
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate filename
    },
});

const upload = multer({ storage: storage }); // Create a multer instance

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await productModel.find({});
        res.send(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Edit first product
router.post('/products/edit', upload.fields([
    { name: 'imageUrl1', maxCount: 1 },
    { name: 'imageUrl2', maxCount: 1 },
    { name: 'imageUrl3', maxCount: 1 },
    { name: 'imageUrl4', maxCount: 1 },
    { name: 'imageUrl5', maxCount: 1 },
    { name: 'imageUrl6', maxCount: 1 },
]), async (req, res) => {
    try {
        const { heading, title, name1, description1, price1, name2, description2, price2, name3, description3, price3, name4, description4, price4, name5, description5, price5, name6, description6, price6 } = req.body;

        // Find the first product document
        let product = await productModel.findOne({});

        if (!product) {
            return res.status(404).json({ message: 'No products found' });
        }

        // Update the product fields
        product.heading = heading;
        product.title = title;
        product.name1 = name1;
        product.description1 = description1;
        product.price1 = price1;
        product.name2 = name2;
        product.description2 = description2;
        product.price2 = price2;
        product.name3 = name3;
        product.description3 = description3;
        product.price3 = price3;
        product.name4 = name4;
        product.description4 = description4;
        product.price4 = price4;
        product.name5 = name5;
        product.description5 = description5;
        product.price5 = price5;
        product.name6 = name6;
        product.description6 = description6;
        product.price6 = price6;

        // Update image URLs if new files are uploaded
        for (let i = 1; i <= 6; i++) {
            if (req.files[`imageUrl${i}`]) {
                // Delete old file from server if exists
                if (product[`imageUrl${i}`]) {
                    const oldImagePath = path.join(__dirname, '../', product[`imageUrl${i}`]); // Corrected path
                    fs.unlink(oldImagePath, (err) => {
                        if (err) {
                            console.error(`Error deleting old image for imageUrl${i}:`, err);
                            // Proceed to replace the image URL regardless of unlink success
                        }
                    });
                }
                // Update with new filename, ensuring there's no extra 'uploads/' prefix
                product[`imageUrl${i}`] = `uploads/${req.files[`imageUrl${i}`][0].filename}`;
            }
        }

        // Save the updated product document
        await product.save();
        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
