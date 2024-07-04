const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let regionSchema = new Schema({
    code: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    provinces: [{
        code: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        communes: [{
            code: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }]
    }]
}, {
    timestamps: true
});

mongoose.model('Region', regionSchema);