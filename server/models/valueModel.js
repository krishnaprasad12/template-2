const mongoose = require('mongoose');

// this the schema for the contactUs collection
const valueSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true
    },
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
    subheading1: {
        type: String,
        required: true
    },
    description1: {
        type: String,
        required: true
    },
    subheading2: {
        type: String,
        required: true
    },
    description2: {
        type: String,
        required: true
    },
    subheading3: {
        type: String,
        required: true
    },
    description3: {
        type: String,
        required: true
    },
})

const valueModel = mongoose.model('value', valueSchema);
module.exports = valueModel;
