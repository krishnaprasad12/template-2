const mongoose = require('mongoose');

// this the schema for the contactUs collection
const contactSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    call: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    chat: {
        type: String,
        required: true
    },
    videocall: {
        type: String,
        required: true
    }
})

const contactModel = mongoose.model('contactus', contactSchema);
module.exports = contactModel;

