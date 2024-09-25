const mongoose = require('mongoose');

// this the schema for the product collection
const productSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    imageUrl1: {
        type: String,
        required: true
    },
    name1: {
        type: String,
        required: true
    },
    description1: {
        type: String,
        required: true
    },
    price1: {
        type: Number,
        required: true
    },
    imageUrl2: {
        type: String,
        required: true
    },
    name2: {
        type: String,
        required: true
    },
    description2: {
        type: String,
        required: true
    },
    price2: {
        type: Number,
        required: true
    },
    imageUrl3: {
        type: String,
        required: true
    },
    name3: {
        type: String,
        required: true
    },
    description3: {
        type: String,
        required: true
    },
    price3: {
        type: Number,
        required: true
    },
    imageUrl4: {
        type: String,
        required: true
    },
    name4: {
        type: String,
        required: true
    },
    description4: {
        type: String,
        required: true
    },
    price4: {
        type: Number,
        required: true
    },
    imageUrl5: {
        type: String,
        required: true
    },
    name5: {
        type: String,
        required: true
    },
    description5: {
        type: String,
        required: true
    },
    price5: {
        type: Number,
        required: true
    },
    imageUrl6: {
        type: String,
        required: true
    },
    name6: {
        type: String,
        required: true
    },
    description6: {
        type: String,
        required: true
    },
    price6: {
        type: Number,
        required: true
    },
})

const productModel = mongoose.model('product',productSchema);
module.exports = productModel;

