const contactModel = require('../models/contactUsModel');   

const multer = require('multer');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
}); // store the uploaded files in the uploads folder

const upload = multer({ storage: storage }); // create a multer instance


// Get the contactus page

router.get('/contactus',async (req,res) => {
    try {
        const contact = await contactModel.find({});
        res.send(contact);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

module.exports = router;
