const mongoose = require('mongoose');
const Region = mongoose.model('Region');
const utils = require('./utils');

module.exports.regionList = function (req, res) {
    Region.find(
        {},
        function (err, regions) {
            if (err) {
                console.log(err);
                utils.sendJSONresponse(res, 400, err);
            } else {
                utils.sendJSONresponse(res, 200, {
                    data: regions
                });
            }
        })
}