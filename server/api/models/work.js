const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let workSchema = new Schema({
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

mongoose.model('Work', workSchema);