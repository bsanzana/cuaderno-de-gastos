const mongoose = require('mongoose');
const PlantingMethod = mongoose.model('PlantingMethod');
const utils = require('./utils');
const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.getAllPlantingMethods = function (req, res) {
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
    PlantingMethod.find(
        query,
        null,
        {
            sort: sort,
            skip: pageNumber * pageSize,
            limit: pageSize * 1,
            collation: collation
        },
        function (err, plantingMethods) {
            if (err) {
                utils.sendJSONresponse(res, 400, {
                    "message": "Ha ocurrido un error al obtener la información de los métodos de siembra."
                });
                console.log(err);
            } else
                PlantingMethod.countDocuments(query, (err, count) => {
                    utils.sendJSONresponse(res, 200, {
                        meta: {
                            "total-pages": count / pageSize,
                            "total-items": count
                        },
                        links: {
                            self: hostname + '/api/v1/plantingMethods'
                        },
                        data: plantingMethods
                    });
                });
        }
    ).populate(['labor'])
};

module.exports.getPlantingMethod = function (req, res) {
    PlantingMethod.findById(req.params.pid, (err, plantingMethod) => {
        if (err) {
            utils.sendJSONresponse(res, 400, {
                "message": "Ha ocurrido un error al obtener la información del método de siembra."
            });
            console.log(err);
        } else
            utils.sendJSONresponse(res, 200, {
                data: plantingMethod
            });
    }).populate(['labor']);
};

module.exports.createPlantingMethod = function (req, res) {
    let plantingMethod = new PlantingMethod();
    plantingMethod.name = req.body.plantingMethod.name;
    plantingMethod.active = req.body.plantingMethod.active;
    plantingMethod.labor = req.body.plantingMethod.labor;

    plantingMethod.save(function (err) {
        if (err) {
            utils.sendJSONresponse(res, 400, {
                "message": "Ha ocurrido un error al crear el método de siembra.",
                error: err
            });
            console.log(err);
        } else {
            utils.sendJSONresponse(res, 200, {
                "message": "El método de siembra <strong>" + plantingMethod.name + "</strong> fue creado exitosamente."
            });
        }
    });
};

module.exports.editPlantingMethod = function (req, res) {
    if (req.params.pid) {
        PlantingMethod.findById(req.params.pid)
            .exec(
                function (err, plantingMethod) {
                    if (!plantingMethod) {
                        utils.sendJSONresponse(res, 404, {
                            "message": "Método de siembra no encontrado."
                        });
                        return;
                    } else if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al actualizar el método de aplicación."
                        });
                        console.log(err);
                        return;
                    }
                    plantingMethod.name = req.body.plantingMethod.name;
                    plantingMethod.active = req.body.plantingMethod.active;
                    plantingMethod.labor = req.body.plantingMethod.labor;
                    plantingMethod.save(function (err) {
                        if (err) {
                            utils.sendJSONresponse(res, 400, {
                                "message": "Ha ocurrido un error al actualizar el método de siembra."
                            });
                            console.log(err);
                        } else {
                            utils.sendJSONresponse(res, 200, {
                                "message": "El método de siembra " + plantingMethod.name + " ha sido actualizado exitosamente."
                            });
                        }
                    });
                }
            );
    } else
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró el método de siembra."
        });
};

module.exports.deletePlantingMethod = function (req, res) {
    /** VER QUE PASA CUANDO SEMILLA ESTÁ SIENDO UTILIZADA **/
    if (req.params.pid) {
        PlantingMethod.findByIdAndRemove(req.params.pid)
            .exec(
                function (err, plantingMethod) {
                    if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al eliminar el método de siembra."
                        });
                        console.log(err);
                        return;
                    }
                    utils.sendJSONresponse(res, 200, {
                        "message": "El método de siembra " + plantingMethod.name + " fue eliminado exitosamente."
                    });
                }
            )
    } else {
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró el método de siembra."
        });
    }
};

module.exports.plantingMethodList = function (req, res) {
    PlantingMethod.find({}, function (err, plantingMethods) {
        if (err) {
            console.log(err);
            utils.sendJSONresponse(res, 400, err);
        } else {
            utils.sendJSONresponse(res, 201, {
                data: plantingMethods
            });
        }
    })
}