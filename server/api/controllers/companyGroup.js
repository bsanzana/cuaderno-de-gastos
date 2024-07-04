const mongoose = require('mongoose');
const CompanyGroup = mongoose.model('CompanyGroup');
const utils = require('./utils');
const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.getAllCompanyGroups = function (req, res) {
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
    CompanyGroup.find(
        query,
        null,
        {
            sort: sort,
            skip: pageNumber * pageSize,
            limit: pageSize * 1,
            collation: collation
        },
        function (err, companyGroups) {
            if (err) {
                utils.sendJSONresponse(res, 400, {
                    "message": "Ha ocurrido un error al obtener la información de los grupos de productores."
                });
                console.log(err);
            }
            else
                CompanyGroup.countDocuments(query, (err, count) => {
                    utils.sendJSONresponse(res, 200, {
                        meta: {
                            "total-pages": count / pageSize,
                            "total-items": count
                        },
                        links: {
                            self: hostname + '/api/v1/companyGroups'
                        },
                        data: companyGroups
                    });
                });
        }
    ).populate(['advisors'])
};

module.exports.getCompanyGroup = function (req, res) {
    console.log('get company: ', req.params.pid)
    CompanyGroup.findById(req.params.pid, (err, companyGroup) => {
        if (err) {
            utils.sendJSONresponse(res, 400, {
                "message": "Ha ocurrido un error al obtener la información del grupo de productores."
            });
            console.log(err);
        }
        else
            utils.sendJSONresponse(res, 200, {
                data: companyGroup
            });
    });
};

module.exports.createCompanyGroup = function (req, res) {
    let companyGroup = new CompanyGroup();
    console.log('llega: ', req.body.companyGroup)
    companyGroup.name = req.body.companyGroup.name;
    if(req.body.companyGroup.advisors){
        companyGroup.advisors = req.body.companyGroup.advisors;
    }
    
    companyGroup.save(function (err) {
        if (err){
            utils.sendJSONresponse(res, 404, {
                "message": "Ha ocurrido un error al crear el grupo de productores.",
                error: err
            });
        }
        else {
            utils.sendJSONresponse(res, 200, {
                "message": "El grupo de productores <strong>" + companyGroup.name + "</strong> fue creado exitosamente.",
                data: companyGroup
            });
        }
    });
};

module.exports.editCompanyGroup = function (req, res) {
    if (req.params.pid) {
        CompanyGroup.findById(req.params.pid)
            .exec(
                function (err, companyGroup) {
                    if (!companyGroup) {
                        utils.sendJSONresponse(res, 404, {
                            "message": "Grupo de productores no encontrado."
                        });
                        return;
                    } else if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al actualizar el grupo de productores."
                        });
                        console.log(err);
                        return;
                    }
                    companyGroup.name = req.body.companyGroup.name;
                    companyGroup.advisors = req.body.companyGroup.advisors;
                    companyGroup.save(function (err) {
                        if (err){
                            utils.sendJSONresponse(res, 400, {
                                "message": "Ha ocurrido un error al actualizar el grupo de productores."
                            });
                            console.log(err);
                        }
                        else {
                            utils.sendJSONresponse(res, 200, {
                                "message": "El grupo de productores " + companyGroup.name + " ha sido actualizado exitosamente."
                            });
                        }
                    });
                }
            );
    } else
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró el grupo de productores."
        });
};

module.exports.deleteCompanyGroup = function (req, res) {
    /** TODO: VER QUE PASA CUANDO PRODUCTO QUÍMICO ESTÁ SIENDO UTILIZADO */
    if (req.params.pid) {
        CompanyGroup.findByIdAndRemove(req.params.pid)
            .exec(
                function (err, companyGroup) {
                    if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al eliminar el grupo de productores."
                        });
                        console.log(err);
                        return;
                    }
                    utils.sendJSONresponse(res, 200, {
                        "message": "El grupo de productores " + companyGroup.name + " fue eliminado exitosamente."
                    });
                }
            )
    } else {
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró el grupo de productores."
        });
    }
};

module.exports.companyGroupList = function (req, res) {
    CompanyGroup.find({}, function (err, companyGroups) {
        if (err) {
            console.log(err);
            utils.sendJSONresponse(res, 400, err);
        } else {
            utils.sendJSONresponse(res, 201, {
                data: companyGroups
            });
        }
    })
}
