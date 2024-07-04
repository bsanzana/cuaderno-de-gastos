const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let chemicalProductSchema = new Schema({
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

mongoose.model('ChemicalProduct', chemicalProductSchema);