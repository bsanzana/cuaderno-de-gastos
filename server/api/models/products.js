const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'CategoryProducts'
    },
}, {
    timestamps: true
});

mongoose.model('Products', productsSchema);