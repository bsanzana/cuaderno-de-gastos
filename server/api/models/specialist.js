const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let specialistSchema = new Schema({
    rut: {
        type: String,
        required: false,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true
    },
    active: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: null
    }
    
}, {
    timestamps: true
});


mongoose.model('Specialist', specialistSchema);
