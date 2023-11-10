const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const DishSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    cat: {
        type: String,
        required: true
    },
    subcat: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: { type: String, required: true },
    description: String,

}, { timestamps: true});

const dish = mongoose.model('dish', DishSchema);

module.exports = dish;
