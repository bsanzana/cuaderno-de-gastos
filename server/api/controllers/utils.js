const jsonDiff = require('json-diff');
const fs = require("fs");

module.exports.sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.objectDiff = function (oldObject, newObject) {
    return JSON.stringify(jsonDiff.diff(oldObject, newObject), undefined, 4);
};


module.exports.guardarArchivos = function(newPath, oldPath ){
    fs.renameSync(oldPath, newPath);
    fs.unlink(oldPath, () => {});
}