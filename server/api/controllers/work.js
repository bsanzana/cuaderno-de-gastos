const mongoose = require('mongoose');
const Work = mongoose.model('Work');
const utils = require('./utils');
const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.getAllWorks = function (req, res) {
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
    Work.find(
        query,
        null,
        {
            sort: sort,
            skip: pageNumber * pageSize,
            limit: pageSize * 1,
            collation: collation
        },
        function (err, works) {
            if (err) {
                utils.sendJSONresponse(res, 400, {
                    "message": "Ha ocurrido un error al obtener la información de las labores."
                });
                console.log(err);
            } else
                Work.countDocuments(query, (err, count) => {
                    utils.sendJSONresponse(res, 200, {
                        meta: {
                            "total-pages": count / pageSize,
                            "total-items": count
                        },
                        links: {
                            self: hostname + '/api/v1/works'
                        },
                        data: works
                    });
                });
        }
    )
};

module.exports.getWork = function (req, res) {
    Work.findById(req.params.wid, (err, work) => {
        if (err) {
            utils.sendJSONresponse(res, 400, {
                "message": "Ha ocurrido un error al obtener la información de la labor."
            });
            console.log(err);
        } else
            utils.sendJSONresponse(res, 200, {
                data: work
            });
    });
};

module.exports.createWork = function (req, res) {
    let work = new Work();
    work.name = req.body.work.name;
    work.active = req.body.work.active;

    work.save(function (err) {
        if (err)
            utils.sendJSONresponse(res, 404, {
                "message": "Ha ocurrido un error al crear la labor.",
                error: err
            });
        else {
            utils.sendJSONresponse(res, 200, {
                "message": "La labor <strong>" + work.name + "</strong> fue creada exitosamente."
            });
        }
    });
};

module.exports.editWork = function (req, res) {
    console.log(req.body)
    if (req.params.wid) {
        Work.findById(req.params.wid)
            .exec(
                function (err, work) {
                    if (!work) {
                        utils.sendJSONresponse(res, 404, {
                            "message": "Labor no encontrada."
                        });
                        return;
                    } else if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al actualizar la labor."
                        });
                        console.log(err);
                        return;
                    }
                    work.name = req.body.work.name;
                    work.active = req.body.work.active;
                    work.save(function (err) {
                        if (err) {
                            utils.sendJSONresponse(res, 400, {
                                "message": "Ha ocurrido un error al actualizar la labor."
                            });
                            console.log(err);
                        } else {
                            utils.sendJSONresponse(res, 200, {
                                "message": "La labor " + work.name + " ha sido actualizada exitosamente."
                            });
                        }
                    });
                }
            );
    } else
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró la labor."
        });
};

module.exports.deleteWork = function (req, res) {
    /** TODO: VER QUE PASA CUANDO SEMILLA ESTÁ SIENDO UTILIZADA */
    if (req.params.wid) {
        Work.findByIdAndRemove(req.params.wid)
            .exec(
                function (err, work) {
                    if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al eliminar la labor."
                        });
                        console.log(err);
                        return;
                    }
                    utils.sendJSONresponse(res, 200, {
                        "message": "La labor " + work.name + " fue eliminada exitosamente."
                    });
                }
            )
    } else {
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró la labor."
        });
    }
};

module.exports.workList = function (req, res) {
    Work.find({}, function (err, works) {
        if (err) {
            console.log(err);
            utils.sendJSONresponse(res, 400, err);
        } else {
            utils.sendJSONresponse(res, 201, {
                data: works
            });
        }
    })
}