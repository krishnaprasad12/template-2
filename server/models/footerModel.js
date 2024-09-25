const mongoose = require('mongoose');

// this the schema for the contactUs collection
const footerSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
})

const footerModel = mongoose.model('footer', footerSchema);
module.exports = footerModel;
