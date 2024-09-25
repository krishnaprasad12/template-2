const mongoose = require('mongoose');

// this the schema for the contactUs collection
const startSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

const startModel = mongoose.model('start', startSchema);
module.exports = startModel;
