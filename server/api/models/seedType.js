const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let seedTypeSchema = new Schema({
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

mongoose.model('SeedType', seedTypeSchema);