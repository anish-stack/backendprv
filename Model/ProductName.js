// ProductName.js

const mongoose = require('mongoose');

const productNameSchema = new mongoose.Schema({
    ProductName: { type: String },
    subcategory: { type: String },
    maincategory: { type: String }
});

const ProductName = mongoose.model('ProductName', productNameSchema);

module.exports = ProductName;
