const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let companyGroupSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        default: true
    },
    advisors: [
        { 
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false
        }
    ]
}, {
    timestamps: true
});

mongoose.model('CompanyGroup', companyGroupSchema);
