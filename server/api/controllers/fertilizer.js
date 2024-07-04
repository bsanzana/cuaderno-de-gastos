const mongoose = require('mongoose');
const Fertilizer = mongoose.model('Fertilizer');
const utils = require('./utils');
const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.getAllFertilizers = function (req, res) {
    let hostname = req.headers.host;
    let requestData = JsonApiQueryParser.parseRequest(req.url);
    let pageNumber = requestData.queryData.page.number || 0;
    let pageSize = requestData.queryData.page.size || 10;
    let fields = requestData.queryData.fields;
    let sort = requestData.queryData.sort;
    let collation = {locale: 'es'};
    let query = {};

    Object.keys(fields).forEach(function (key) {
        if (fields[key] !== null) {
            query[key] = new RegExp(fields[key], 'i');
        }
    });
    Fertilizer.find(
        query,
        null,
        {
            sort: sort,
            skip: pageNumber * pageSize,
            limit: pageSize * 1,
            collation: collation
        },
        function (err, fertilizers) {
            if (err) {
                utils.sendJSONresponse(res, 400, {
                    "message": "Ha ocurrido un error al obtener la información de los fertilizantes."
                });
                console.log(err);
            } else
                Fertilizer.countDocuments(query, (err, count) => {
                    utils.sendJSONresponse(res, 200, {
                        meta: {
                            "total-pages": count / pageSize,
                            "total-items": count
                        },
                        links: {
                            self: hostname + '/api/v1/fertilizers'
                        },
                        data: fertilizers
                    });
                });
        }
    )
};

module.exports.getFertilizer = function (req, res) {
    Fertilizer.findById(req.params.pid, (err, fertilizer) => {
        if (err) {
            utils.sendJSONresponse(res, 400, {
                "message": "Ha ocurrido un error al obtener la información del fertilizante."
            });
            console.log(err);
        } else
            utils.sendJSONresponse(res, 200, {
                data: fertilizer
            });
    });
};

module.exports.createFertilizer = function (req, res) {
    let fertilizer = new Fertilizer();
    fertilizer.name = req.body.fertilizer.name;

    fertilizer.save(function (err) {
        if (err) {
            utils.sendJSONresponse(res, 400, {
                "message": "Ha ocurrido un error al crear el fertilizante.",
                error: err
            });
            console.log(err);
        } else {
            utils.sendJSONresponse(res, 200, {
                "message": "El fertilizante <strong>" + fertilizer.name + "</strong> fue creado exitosamente."
            });
        }
    });
};

module.exports.editFertilizer = function (req, res) {
    if (req.params.pid) {
        Fertilizer.findById(req.params.pid)
            .exec(
                function (err, fertilizer) {
                    if (!fertilizer) {
                        utils.sendJSONresponse(res, 404, {
                            "message": "Fertilizante no encontrado."
                        });
                        return;
                    } else if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al actualizar el fertilizante."
                        });
                        console.log(err);
                        return;
                    }
                    fertilizer.name = req.body.fertilizer.name;
                    fertilizer.save(function (err) {
                        if (err) {
                            utils.sendJSONresponse(res, 400, {
                                "message": "Ha ocurrido un error al actualizar el fertilizante."
                            });
                            console.log(err);
                        } else {
                            utils.sendJSONresponse(res, 200, {
                                "message": "El fertilizante " + fertilizer.name + " ha sido actualizado exitosamente."
                            });
                        }
                    });
                }
            );
    } else
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró el fertilizante."
        });
};

module.exports.deleteFertilizer = function (req, res) {
    /** TODO: VER QUE PASA CUANDO FERTILIZANTE ESTÁ SIENDO UTILIZADO */
    if (req.params.pid) {
        Fertilizer.findByIdAndRemove(req.params.pid)
            .exec(
                function (err, fertilizer) {
                    if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al eliminar el fertilizante."
                        });
                        console.log(err);
                        return;
                    }
                    utils.sendJSONresponse(res, 200, {
                        "message": "El fertilizante " + fertilizer.name + " fue eliminado exitosamente."
                    });
                }
            )
    } else {
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró el fertilizante."
        });
    }
};

module.exports.fertilizerList = function (req, res) {
    Fertilizer.find({}, function (err, fertilizers) {
        if (err) {
            console.log(err);
            utils.sendJSONresponse(res, 400, err);
        } else {
            utils.sendJSONresponse(res, 201, {
                data: fertilizers
            });
        }
    })
}