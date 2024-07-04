
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

var imageStorage = multer.diskStorage({
    destination: './uploads/avatar/',
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err)

        cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
});

module.exports.avatar = multer({ storage: imageStorage });
