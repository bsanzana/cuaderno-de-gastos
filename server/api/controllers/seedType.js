const mongoose = require('mongoose');
const SeedType = mongoose.model('SeedType');
const utils = require('./utils');
const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.getAllSeedTypes = function (req, res) {
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
            query[key] = fields[key], 'i';
        }
    });
    SeedType.find(
        query,
        null,
        {
            sort: sort,
            skip: pageNumber * pageSize,
            limit: pageSize * 1,
            collation: collation
        },
        function (err, seedTypeTypes) {
            if (err) {
                utils.sendJSONresponse(res, 400, {
                    "message": "Ha ocurrido un error al obtener la información de los tipos de semilla."
                });
                console.log(err);
            } else
                SeedType.countDocuments(query, (err, count) => {
                    utils.sendJSONresponse(res, 200, {
                        meta: {
                            "total-pages": count / pageSize,
                            "total-items": count
                        },
                        links: {
                            self: hostname + '/api/v1/seedTypeTypes'
                        },
                        data: seedTypeTypes
                    });
                });
        }
    )
};

module.exports.getSeedType = function (req, res) {
    SeedType.findById(req.params.pid, (err, seedType) => {
        if (err) {
            utils.sendJSONresponse(res, 400, {
                "message": "Ha ocurrido un error al obtener la información del tipo de semilla."
            });
            console.log(err);
        } else
            utils.sendJSONresponse(res, 200, {
                data: seedType
            });
    });
};

module.exports.createSeedType = function (req, res) {
    let seedType = new SeedType();
    console.log(req.body)
    seedType.name = req.body.seedType.name;
    seedType.active = req.body.seedType.active;


    seedType.save(function (err) {
        if (err)
            utils.sendJSONresponse(res, 404, {
                "message": "Ha ocurrido un error al crear el tipo de semilla.",
                error: err
            });
        else {
            utils.sendJSONresponse(res, 200, {
                "message": "El tipo de semilla <strong>" + seedType.name + "</strong> fue creado exitosamente."
            });
        }
    });
};

module.exports.editSeedType = function (req, res) {
    if (req.params.pid) {
        SeedType.findById(req.params.pid)
            .exec(
                function (err, seedType) {
                    if (!seedType) {
                        utils.sendJSONresponse(res, 404, {
                            "message": "Tipo de semilla no encontrado."
                        });
                        return;
                    } else if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al actualizar el tipo de semilla."
                        });
                        console.log(err);
                        return;
                    }
                    seedType.name = req.body.seedType.name;
                    seedType.active = req.body.seedType.active;

                    seedType.save(function (err) {
                        if (err) {
                            utils.sendJSONresponse(res, 400, {
                                "message": "Ha ocurrido un error al actualizar el tipo de semilla."
                            });
                            console.log(err);
                        } else {
                            utils.sendJSONresponse(res, 200, {
                                "message": "El tipo de semilla " + seedType.name + " ha sido actualizado exitosamente."
                            });
                        }
                    });
                }
            );
    } else
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró el tipo de semilla."
        });
};

module.exports.deleteSeedType = function (req, res) {
    /** TODO: VER QUE PASA CUANDO SEMILLA ESTÁ SIENDO UTILIZADA */
    if (req.params.pid) {
        SeedType.findByIdAndRemove(req.params.pid)
            .exec(
                function (err, seedType) {
                    if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al eliminar el tipo de semilla."
                        });
                        console.log(err);
                        return;
                    }
                    utils.sendJSONresponse(res, 200, {
                        "message": "El tipo de semilla " + seedType.name + " fue eliminado exitosamente."
                    });
                }
            )
    } else {
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró el tipo semilla."
        });
    }
};

module.exports.seedTypeList = function (req, res) {
    SeedType.find({}, function (err, seedTypes) {
        if (err) {
            console.log(err);
            utils.sendJSONresponse(res, 400, err);
        } else {
            utils.sendJSONresponse(res, 201, {
                data: seedTypes
            });
        }
    })
}