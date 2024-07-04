const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let seasonSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    init_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    actual: {
        type: Boolean,
        required: true,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

mongoose.model('Season', seasonSchema);