const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let fertilizerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

mongoose.model('Fertilizer', fertilizerSchema);