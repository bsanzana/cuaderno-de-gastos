const mongoose = require('mongoose');
const Machinery = mongoose.model('Machinery');
const utils = require('./utils');
const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.getAllMachines = function (req, res) {
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
    Machinery.find(
        query,
        null,
        {
            sort: sort,
            skip: pageNumber * pageSize,
            limit: pageSize * 1,
            collation: collation
        },
        function (err, machines) {
            if (err) {
                utils.sendJSONresponse(res, 400, {
                    "message": "Ha ocurrido un error al obtener la información de las maquinarias."
                });
                console.log(err);
            } else
                Machinery.countDocuments(query, (err, count) => {
                    utils.sendJSONresponse(res, 200, {
                        meta: {
                            "total-pages": count / pageSize,
                            "total-items": count
                        },
                        links: {
                            self: hostname + '/api/v1/machines'
                        },
                        data: machines
                    });
                });
        }
    ).populate(['labor'])
};

module.exports.getMachinery = function (req, res) {
    Machinery.findById(req.params.pid, (err, machinery) => {
        if (err) {
            utils.sendJSONresponse(res, 400, {
                "message": "Ha ocurrido un error al obtener la información de la maquinaria."
            });
            console.log(err);
        } else
            utils.sendJSONresponse(res, 200, {
                data: machinery
            });
    });
};

module.exports.createMachinery = function (req, res) {
    let machinery = new Machinery();
    machinery.name = req.body.machinery.name;
    machinery.active = req.body.machinery.active;
    machinery.labor = req.body.machinery.labor;

    machinery.save(function (err) {
        if (err) {
            utils.sendJSONresponse(res, 400, {
                "message": "Ha ocurrido un error al crear la maquinaria."
            });
            console.log(err);
        } else {
            utils.sendJSONresponse(res, 200, {
                "message": "La maquinaria " + machinery.name + " fue creada exitosamente.",
                data: machinery
            });
        }
    });
};

module.exports.editMachinery = function (req, res) {
    if (req.params.pid) {
        Machinery.findById(req.params.pid)
            .exec(
                function (err, machinery) {
                    if (!machinery) {
                        utils.sendJSONresponse(res, 404, {
                            "message": "Maquinaria no encontrada."
                        });
                        return;
                    } else if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al actualizar la maquinaria."
                        });
                        console.log(err);
                        return;
                    }
                    machinery.name = req.body.machinery.name;
                    machinery.active = req.body.machinery.active;
                    machinery.labor = req.body.machinery.labor;
                    machinery.save(function (err) {
                        if (err) {
                            utils.sendJSONresponse(res, 400, {
                                "message": "Ha ocurrido un error al actualizar la maquinaria."
                            });
                            console.log(err);
                        } else {
                            utils.sendJSONresponse(res, 200, {
                                "message": "La maquinaria " + machinery.name + " ha sido actualizada exitosamente."
                            });
                        }
                    });
                }
            );
    } else
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró la maquinaria."
        });
};

module.exports.deleteMachinery = function (req, res) {
    /** TODO: VER QUE PASA CUANDO MAQUINARIA ESTÁ SIENDO UTILIZADA */
    if (req.params.pid) {
        Machinery.findByIdAndRemove(req.params.pid)
            .exec(
                function (err, machinery) {
                    if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al eliminar la maquinaria."
                        });
                        console.log(err);
                        return;
                    }
                    utils.sendJSONresponse(res, 200, {
                        "message": "La maquinaria " + machinery.name + " fue eliminada exitosamente."
                    });
                }
            )
    } else {
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró la maquinaria."
        });
    }
};

module.exports.machineList = function (req, res) {
    Machinery.find({}, function (err, machines) {
        if (err) {
            console.log(err);
            utils.sendJSONresponse(res, 400, err);
        } else {
            utils.sendJSONresponse(res, 201, {
                data: machines
            });
        }
    }).select(["name", "_id"])
}