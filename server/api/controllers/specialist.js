const mongoose = require('mongoose');
const Specialist = mongoose.model('Specialist');
const utils = require('./utils');
const Rut = require('rutjs');
const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();
const fs = require('fs');

module.exports.getAllSpecialists = function (req, res) {
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
            query[key] = fields[key];
        }
    });

    console.log('query specialists: ', query)
    Specialist.find(
        query,
        null,
        {
            sort: sort,
            skip: pageNumber * pageSize,
            limit: pageSize * 1,
            collation: collation
        },
        function (err, specialists) {
            if (err) {
                utils.sendJSONresponse(res, 400, {
                    "message": "Ha ocurrido un error al obtener la información del especialista."
                });
                console.log(err);
                return;
            } else
                Specialist.countDocuments(query, (err, count) => {
                    utils.sendJSONresponse(res, 200, {
                        meta: {
                            "total-pages": count / pageSize,
                            "total-items": count
                        },
                        links: {
                            self: hostname + '/api/v1/users'
                        },
                        data: specialists
                    });
                });
        }
    )
};

module.exports.getSpecialist = function (req, res) {
    Specialist.findById(req.params.uid, (err, user) => {
        if (err) {
            utils.sendJSONresponse(res, 400, {
                "message": "Ha ocurrido un error al obtener la información del especialista."
            });
            console.log(err);
        } else {
            utils.sendJSONresponse(res, 201, {
                data: user
            });
        }
    });
}

module.exports.editSpecialist = function (req, res) {
    if (req.params.uid) {
        Specialist.findById(req.params.uid)
            .exec(
                function (err, user) {
                    if (!user) {
                        utils.sendJSONresponse(res, 404, {
                            "message": "Especialista no encontrado."
                        });
                        return;
                    } else if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al actualizar el especialista."
                        });
                        console.log(err);
                        return;
                    }
                    user.rut = new Rut(req.body.user.rut).getNiceRut(false);
                    user.name = req.body.user.name;
                    user.lastname = req.body.user.lastname;
                    user.email = req.body.user.email;
                    user.phone = req.body.user.phone;
                    user.active = req.body.user.active;

                    if (req.file) {
                        const old = './uploads/specialists/'+user.image;
                        if (fs.existsSync(old)) {
                            fs.unlinkSync(old);
                        }
                        user.image = req.file.filename;
                    }
                    user.save(function (err) {
                        if (err) {
                            utils.sendJSONresponse(res, 400, {
                                "message": "Ha ocurrido un error al actualizar el usuario."
                            });
                            console.log(err);
                        } else {
                            utils.sendJSONresponse(res, 200, {
                                "message": "El usuario " + user.name + " ha sido actualizado exitosamente."
                            });
                        }
                    });
                }
            )
    } else {
        utils.sendJSONresponse(res, 404, {
            "message": "Usuario no encontrado."
        });
    }
}

module.exports.createSpecialist = function (req, res) {
    let specialist = new Specialist();

    console.log('create: ', req.body)

    // user.rut = new Rut(req.body.user.rut).getNiceRut(false);+
    specialist.rut = req.body.user.rut;
    specialist.name = req.body.user.name;
    specialist.lastname = req.body.user.lastname;
    specialist.email = req.body.user.email;
    specialist.phone = req.body.user.phone;
    specialist.active = req.body.user.active;
    if (req.file) {
        specialist.image = req.file.filename;
    }


    specialist.save(function (err) {
        if (err) {
            utils.sendJSONresponse(res, 400, {
                "message": "Ha ocurrido un error al crear el usuario."
            });
            console.log(err);
        } else {
            utils.sendJSONresponse(res, 200, {
                "message": "El usuario <strong>" + specialist.name + "</strong> fue creado exitosamente.",
                data: specialist
            });
        }
    });
}



