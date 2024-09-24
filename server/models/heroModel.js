const mongoose = require('mongoose');

// this the schema for the contactUs collection
const heroSchema = new mongoose.Schema({
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
    count1: {
        type: Number,
        required: true
    },
    description1: {
        type: String,
        required: true
    },
    count2: {
        type: Number,
        required: true
    },
    description2: {
        type: String,
        required: true
    },
})

const heroModel = mongoose.model('hero', heroSchema);
module.exports = heroModel;
