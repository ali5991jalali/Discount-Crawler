// Required pakages
const mongoose = require('mongoose');
// Schema
const Schema = mongoose.Schema;
// schema
const schema = new Schema({
    productId: { type: Number, unique: true },
    faTitle: { type: String },
    enTitle: { type: String },
    lastPrice: { type: Number },
    activePrice: { type: Number },
    percent: { type: Number },
    image: { type: String },
    link: { type: String }
})
// Model
const model = mongoose.model('Digikala', schema, 'Digikala');
module.exports = model;
