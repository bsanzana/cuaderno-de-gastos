const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let visitSchema = new Schema({

}, {
    timestamps: true
});

mongoose.model('Visit', visitSchema);