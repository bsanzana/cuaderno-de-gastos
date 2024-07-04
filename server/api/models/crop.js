const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CropSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

mongoose.model('Crop', CropSchema);